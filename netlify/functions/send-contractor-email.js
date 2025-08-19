const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const params = new URLSearchParams(event.body);
        const formData = {};
        for (const [key, value] of params) {
            formData[key] = value;
        }

        console.log('Function called with data:', formData);

        // Only process contractor inquiries
        if (formData.service !== 'contractor') {
            console.log('Not a contractor inquiry, skipping');
            return { statusCode: 200, body: 'Not a contractor inquiry' };
        }

        console.log('Processing contractor inquiry for:', formData.email);

        // Set SendGrid API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Simple email with contractor briefing
        const msg = {
            to: formData.email,
            from: 'greenbridgeagbrokers@gmail.com',
            subject: 'Sales Agent Opportunity - Greenbridge Agriculture Brokerage Co',
            text: `Dear ${formData.name || 'Potential Sales Agent'},

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
This document is confidential and proprietary.`
        };

        console.log('Sending email to:', formData.email);
        await sgMail.send(msg);
        console.log('Email sent successfully');

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'Contractor briefing email sent successfully',
                recipient: formData.email
            })
        };

    } catch (error) {
        console.error('SendGrid error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to send contractor email',
                details: error.message 
            })
        };
    }
};