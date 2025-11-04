#
# Lambda function to receive incoming email to the domain
# If mail contains my secret, forward it outside of the domain to the addresses from the object embedded in the email
# If mail doesn't have my secret, it must be from someone else.  Send it to me.
#
# html_parser is a utility to parse emails sent from me to someone else
# 

import os
import boto3
import email
import re
import json
import html_parser
from botocore.exceptions import ClientError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.mime.base import MIMEBase
from email import encoders
import base64

region = os.environ['Region']

def get_message_from_s3(message_id):

    incoming_email_bucket = os.environ['MailS3Bucket']
    incoming_email_prefix = os.environ['MailS3Prefix']

    if incoming_email_prefix:
        object_path = (incoming_email_prefix + "/" + message_id)
    else:
        object_path = message_id
    
    object_http_path = (f"http://s3.console.aws.amazon.com/s3/object/{incoming_email_bucket}/{object_path}?region={region}")

    # Create a new S3 client.
    client_s3 = boto3.client("s3")

    # Get the email object from the S3 bucket.
    object_s3 = client_s3.get_object(Bucket=incoming_email_bucket,
        Key=object_path)
    # Read the content of the message.
    file = object_s3['Body'].read()

    file_dict = {
        "file": file,
        "path": object_http_path
    }

    return file_dict

def send_email(message):
    aws_region = os.environ['Region']

    # Create a new SES client.
    client_ses = boto3.client('ses', region)

    # Send the email.
    try:
        #Provide the contents of the email.
        response = client_ses.send_raw_email(
            Source=message['Source'],
            Destinations=message['Destinations'],
            RawMessage={
                'Data':message['Data']
            }
        )

    # Display an error if something goes wrong.
    except ClientError as e:
        output = e.response['Error']['Message']
    else:
        output = "Email sent! Message ID: " + response['MessageId']

    return output

def create_message(processed_email):
    print("creating message")
    sender = os.environ['MailSender']
    # if email is from Paul, ToAddresses will be in the userCode else send to Paul
    userCode = processed_email['userCode']
    recipients = userCode['toAddresses'] if userCode else [os.environ['MailRecipient']]

    # Create a MIME container and append html body.
    msg = MIMEMultipart()
    text_part = MIMEText(processed_email['body'], _subtype="html")
    msg.attach(text_part)

    # Add subject, from and to lines.
    msg['Subject'] = processed_email['Subject']
    msg['From'] = sender
    msg['To'] = ', '.join(recipients)

    # Attach email attachments
    for part in processed_email['attachments']:
        att = MIMEBase(part.get_content_maintype(), part.get_content_subtype())
        att.set_payload(part.get_payload(decode=True))
        encoders.encode_base64(att)
        att.add_header('Content-Disposition', f'attachment; filename="{part.get_filename()}"')
        msg.attach(att)

    # Add Face header (base64 encoded image, max ~1KB)
    # THESE NEVER WORKED BUT MAYBE WE'LL IMPROVE IT ANOTHER TIME
    with open('avatar.jpg', 'rb') as f:
        face_data = base64.b64encode(f.read()).decode('ascii')
        msg['Face'] = face_data
    msg['X-Face'] = os.environ['XFace']

    # Create message object that is SES friendly
    message = {
        "Source": sender,
        "Destinations": recipients,
        "Data": msg.as_string()
    }

    return message



def lambda_handler(event, context):
    print("received message")
    # Get the unique ID of the message. This corresponds to the name of the file in S3.
    message_id = event['Records'][0]['ses']['mail']['messageId']
    print(f"Received message ID {message_id}")

    # Retrieve the file from the S3 bucket and parse
    file_dict = get_message_from_s3(message_id)
    mailobject = email.message_from_string(file_dict['file'].decode('utf-8'))

    # If the email is from paul's gmail account and has his secret, it's from him.
    paulHasCode = mailobject['From'].startswith(os.environ['FromPaulAddress'])
    emailIsFromPaulsGmail = mailobject['Return-Path'] == "<" + os.environ['PTonerPersonal'] + ">"
    isFromPaul = paulHasCode and emailIsFromPaulsGmail
        
    # Parse html for userCode and attachments
    processedEmail = html_parser.process_email_body(mailobject, isFromPaul)
    processedEmail['Subject'] = mailobject['Subject']

    #Create the message.
    message = create_message(processedEmail)

    # Send the email and print the result.
    result = send_email(message)
    print(result)


