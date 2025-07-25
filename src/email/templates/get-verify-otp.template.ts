export const getVerifyOtpTemplate = (
  otp: string,
  firstName: string = 'User',
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #f8f9fa;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .otp-container {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #28a745;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>Welcome! Please use the following OTP (One-Time Password) to verify your email address:</p>
            
            <div class="otp-container">
                <div class="otp-code">${otp}</div>
            </div>

            <p>This OTP will expire in 10 minutes for security purposes.</p>
            
            <p>If you did not sign up for this account, you can safely ignore this email.</p>
            
            <p>Best regards,<br>Your Application Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
