const https = require('https');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const params = new URLSearchParams(event.body);
    const formData = {};
    for (const [key, value] of params) {
        formData[key] = value;
    }

    // Only process contractor inquiries
    if (formData.service !== 'contractor') {
        return { statusCode: 200, body: 'Not a contractor inquiry' };
    }

    // Use EmailJS API directly (no complex dependencies)
    const emailData = {
        service_id: 'service_greenbridge',
        template_id: 'template_contractor',
        user_id: 'user_greenbridge123',
        template_params: {
            to_email: formData.email,
            to_name: formData.name || 'Potential Sales Agent',
            from_name: 'Greenbridge Agriculture Brokerage Co',
            subject: 'Sales Agent Opportunity - Greenbridge Agriculture Brokerage Co',
            contractor_briefing: `
Dear ${formData.name || 'Potential Sales Agent'},

Thank you for your interest in joining Greenbridge Agriculture Brokerage Co!

SALES AGENT OPPORTUNITY BRIEFING

We are a Texas-based wholesale brokerage company specializing in legal hemp-derived products under the 2018 Farm Bill. Our mission is to connect licensed growers and CHPL holders with qualified retail buyers, while offering sales agents the opportunity to earn by facilitating professional wholesale transactions.

WHO WE'RE LOOKING FOR:
• Motivated individuals interested in the hemp and cannabis wholesale industry
• Professional, reliable, and able to maintain compliance with all legal requirements
• Great communicators who can build strong relationships with retail buyers
• Organized individuals who can track sales activity and follow standard procedures

WHAT WE OFFER:
• Access to premium hemp-derived products through licensed CHPL holders
• A structured sales model with training and compliance support
• The ability to earn commissions through brokered wholesale sales
• A growing network of industry professionals and opportunities for advancement

NEXT STEPS:
If this sounds like an opportunity you'd like to pursue, we'd love to hear from you!

📧 Please reply to this email or send a message to: greenbridgeagbrokers@gmail.com

In your message, briefly introduce yourself and explain why you're interested in becoming a Sales Agent with Greenbridge Agriculture Brokerage Co.

We look forward to connecting with motivated individuals who want to be part of the growing hemp brokerage industry.

Best regards,
Greenbridge Agriculture Brokerage Co
greenbridgeagbrokers@gmail.com

---
© 2025 Greenbridge Agriculture Brokerage Co. All rights reserved.
This document is confidential and proprietary.
            `
        }
    };

    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(emailData);
        
        const options = {
            hostname: 'api.emailjs.com',
            port: 443,
            path: '/api/v1.0/email/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({
                        statusCode: 200,
                        body: JSON.stringify({ message: 'Contractor email sent successfully' })
                    });
                } else {
                    resolve({
                        statusCode: 500,
                        body: JSON.stringify({ error: 'Email sending failed' })
                    });
                }
            });
        });

        req.on('error', (error) => {
            resolve({
                statusCode: 500,
                body: JSON.stringify({ error: error.message })
            });
        });

        req.write(postData);
        req.end();
    });
};