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

def create_message_to_paul(file_dict):

    sender = os.environ['MailSender']
    recipient = os.environ['MailRecipient']

    separator = ";"

    # Parse the email body.
    mailobject = email.message_from_string(file_dict['file'].decode('utf-8'))
    
    # Create a new subject line.
    subject_original = mailobject['Subject']
    subject = "FW: " + subject_original

    # The body text of the email.
    body_text = ("The attached message was received from "
              + separator.join(mailobject.get_all('From'))
              + ". This message is archived at " + file_dict['path'])

    # The file name to use for the attached message. Uses regex to remove all
    # non-alphanumeric characters, and appends a file extension.
    filename = re.sub('[^0-9a-zA-Z]+', '_', subject_original) + ".eml"

    # Create a MIME container.
    msg = MIMEMultipart()
    # Create a MIME text part.
    text_part = MIMEText(body_text, _subtype="html")
    # Attach the text part to the MIME message.
    msg.attach(text_part)

    # Add subject, from and to lines.
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    # Create a new MIME object.
    att = MIMEApplication(file_dict["file"], filename)
    att.add_header("Content-Disposition", 'attachment', filename=filename)

    # Attach the file object to the message.
    msg.attach(att)

    message = {
        "Source": sender,
        "Destinations": recipient,
        "Data": msg.as_string()
    }

    return message

def send_email(message):
    aws_region = os.environ['Region']

    # Create a new SES client.
    client_ses = boto3.client('ses', region)

    # Send the email.
    try:
        #Provide the contents of the email.
        response = client_ses.send_raw_email(
            Source=message['Source'],
            Destinations=[
                message['Destinations']
            ],
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

def create_message_from_paul(mailobject, processed_email_body):
    print("create_message_from_paul")

    sender = os.environ['MailSender']
    recipient = processed_email_body['userCode']['toAddresses'][0]

    separator = ";"

    # Create a MIME container.
    msg = MIMEMultipart()
    # Create a MIME text part.
    text_part = MIMEText(processed_email_body['body'], _subtype="html")
    # Attach the text part to the MIME message.
    msg.attach(text_part)


    # Add subject, from and to lines.
    msg['Subject'] = mailobject['Subject']
    msg['From'] = os.environ['MailSender']
    msg['To'] = recipient



    message = {
        "Source": sender,
        "Destinations": recipient,
        "Data": msg.as_string()
    }

    return message

# # Util for create_message_from_paul()
# def decode_mail_from_paul(mailobject):
#     print("decode_mail_from_paul")

#     if mailobject.is_multipart():
#         for part in mailobject.walk():
#             # Check for the primary content type
#             ctype = part.get_content_type()
#             cdisp = part.get('Content-Disposition')

#             # Look for the plain text or HTML body part, and exclude attachments
#             if ctype in ('text/plain', 'text/html') and cdisp is None:
#                 # Get the actual content, decoding it based on the charset
#                 body = part.get_payload(decode=True)
#                 charset = part.get_content_charset()
#                 if charset:
#                     return body.decode(charset)
#                 else:
#                     return body.decode() # Default to UTF-8 or a safe default
#     else:
#         # Simple message: just get the payload
#         body = mailobject.get_payload(decode=True)
#         charset = mailobject.get_content_charset()
#         if charset:
#             return body.decode(charset)
#         else:
#             return body.decode()

# # Util for create_message_from_paul()
# def extract_to_addresses(text):
    # Find JSON-like object in the string
    # pattern = r'\{[^{}]*\}'
    # match = re.search(pattern, text)
    
    # if match:
    #     json_str = match.group()
    #     try:
    #         obj = json.loads(json_str)
    #         return obj.get('toAddresses', [])
    #     except json.JSONDecodeError:
    #         return None
    # return None

def lambda_handler(event, context):
    print("received message")
    # Get the unique ID of the message. This corresponds to the name of the file
    # in S3.
    message_id = event['Records'][0]['ses']['mail']['messageId']
    print(f"Received message ID {message_id}")

    # Retrieve the file from the S3 bucket.
    file_dict = get_message_from_s3(message_id)

    mailobject = email.message_from_string(file_dict['file'].decode('utf-8'))
    
    paulHasCode = mailobject['From'].startswith(os.environ['FromPaulAddress'])
    emailIsFromPaulsGmail = mailobject['Return-Path'] == "<" + os.environ['PTonerPersonal'] + ">"

    if paulHasCode and emailIsFromPaulsGmail:
        processedEmail = html_parser.process_email_body(mailobject)

        #Create the message.
        message = create_message_from_paul(mailobject, processedEmail)

        # Send the email and print the result.
        result = send_email(message)
        print(result)


    else:
        print("Email not from Paul")

        # Create the message.
        message = create_message_to_paul(file_dict)

        # Send the email and print the result.
        result = send_email(message)
        print(result)

