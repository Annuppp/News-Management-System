export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpHtml = (otp) => {
    return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">

    <!-- Centers the card vertically & horizontally -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
            <td align="center">

                <!-- White card container -->
                <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); padding:40px 30px;">

                    <!-- Brand header -->
                    <tr>
                        <td align="center" style="padding-bottom:20px;">
                            <h1 style="color:#1e293b; font-size:24px; margin:0;">📰 NewsApp</h1>
                        </td>
                    </tr>

                    <tr>
                        <td align="center">
                            <hr style="border:none; border-top:2px solid #e2e8f0; width:60px; margin:0 auto 20px auto;" />
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td align="center" style="padding-bottom:8px;">
                            <p style="color:#475569; font-size:16px; line-height:1.5; margin:0;">Hello,</p>
                        </td>
                    </tr>

                    <!-- Instruction -->
                    <tr>
                        <td align="center" style="padding-bottom:24px;">
                            <p style="color:#475569; font-size:16px; line-height:1.5; margin:0;">
                                Use the OTP below to verify your email address:
                            </p>
                        </td>
                    </tr>

                    <!-- OTP code display box -->
                    <tr>
                        <td align="center" style="padding-bottom:24px;">
                            <div style="background-color:#f0f9ff; border:2px dashed #38bdf8; border-radius:8px; padding:16px 32px; display:inline-block;">
                                <span style="font-size:36px; font-weight:bold; letter-spacing:12px; color:#0284c7;">
                                    ${otp}
                                </span>
                            </div>
                        </td>
                    </tr>

                    <!-- Expiry notice -->
                    <tr>
                        <td align="center" style="padding-bottom:24px;">
                            <p style="color:#94a3b8; font-size:13px; margin:0;">
                                This OTP is valid for <strong>10 minutes</strong>.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center">
                            <hr style="border:none; border-top:1px solid #e2e8f0; width:100%; margin:0 auto 16px auto;" />
                            <p style="color:#94a3b8; font-size:12px; line-height:1.5; margin:0;">
                                If you didn't request this, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>

  `;
};
