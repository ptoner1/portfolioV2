import { Sha256 } from '@aws-crypto/sha256-js';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { fetchAuthSession } from 'aws-amplify/auth';
import { HttpRequest } from "@aws-sdk/types";

export async function getAwsCredentials() {
  try {
    // This fetches the current session, refreshing tokens if necessary
    const { credentials } = await fetchAuthSession();

    if (!credentials) {
      console.log("User is not authenticated or credentials are not available.");
      return null;
    }

    console.log('Access Key:', credentials.accessKeyId);
    console.log('Secret Key:', credentials.secretAccessKey);
    console.log('Session Token:', credentials.sessionToken);
    
    // You can now use these credentials
    return credentials;

  } catch (error) {
    console.error('Error fetching auth session:', error);
    return null;
  }
}

export async function signRequest(url: string, reqBody: any) {
    // 1. Get your temporary AWS credentials from Amplify
    const credentials = await getAwsCredentials();
    if (!credentials) {
        console.error("Could not retrieve AWS credentials. Is the user logged in?");
        return;
    }

    const region = 'us-east-1'; // The region of your API Gateway
    const service = 'execute-api'; // The service name for API Gateway
    const urlObj = new URL(url);

    // 2. Create a signer instance
    const signer = new SignatureV4({
        credentials,
        region: region,
        service: service,
        sha256: Sha256, // The hashing algorithm implementation
    });

    // 3. Prepare the request object for signing
    // The signer works with the standard Request object
    const requestToSign: HttpRequest = {
        method: 'POST',
        protocol: urlObj.protocol, // e.g., 'https:'
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        headers: {
            'Content-Type': 'application/json',
            'host': urlObj.hostname, // The 'host' header is required for signing
        },
        body: JSON.stringify(reqBody),
    };

    // 4. Sign the request
    try {
        const signedRequest = await signer.sign(requestToSign);
        return signedRequest;
    } catch (error) {
        console.error("Error signing the request:", error);
    }
    
    // const signedRequest = await signer.sign(requestToSign);
    // 
    // 5. Send the signed request using the standard fetch API
    // try {
    //     console.log("Sending signed request...");
    //     // Corrected fetch call
    //     const response = await fetch(url, {
    //         method: signedRequest.method,
    //         headers: signedRequest.headers,
    //         body: signedRequest.body,
    //     });
        
    //     if (!response.ok) {
    //         // Log the error response from AWS for easier debugging
    //         const errorData = await response.text();
    //         throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    //     }

    //     const responseData = await response.json();
    //     console.log("Success:", responseData);
    //     return responseData;

    // } catch (error) {
    //     console.error("Error sending the signed request:", error);
    // }
}

// How you would call it:
// sendSignedRequest({ name: 'Jane Doe', email: 'jane@example.com' });