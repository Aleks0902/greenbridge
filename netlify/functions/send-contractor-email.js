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

        // Only process contractor inquiries
        if (formData.service !== 'contractor') {
            return { statusCode: 200, body: 'Not a contractor inquiry' };
        }

        // Set SendGrid API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Create contractor briefing email
        const msg = {
            to: formData.email,
            from: 'greenbridgeagbrokers@gmail.com',
            subject: 'Sales Agent Opportunity - Greenbridge Agriculture Brokerage Co',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
                    <div style="background: #2E7D32; color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">Greenbridge Agriculture Brokerage Co</h1>
                        <h2 style="margin: 15px 0 0 0; color: #4CAF50; font-size: 22px;">Sales Agent Opportunity</h2>
                    </div>
                    
                    <div style="padding: 30px; background: #f9f9f9;">
                        <p style="font-size: 16px; margin-bottom: 20px;"><strong>Dear ${formData.name || 'Potential Sales Agent'},</strong></p>
                        
                        <p style="line-height: 1.6; margin-bottom: 20px;">Thank you for your interest in joining Greenbridge Agriculture Brokerage Co. We are a Texas-based wholesale brokerage company specializing in legal hemp-derived products under the 2018 Farm Bill. Our mission is to connect licensed growers and CHPL holders with qualified retail buyers, while offering sales agents the opportunity to earn by facilitating professional wholesale transactions.</p>
                        
                        <div style="background: white; padding: 25px; margin: 25px 0; border-left: 4px solid #4CAF50; border-radius: 5px;">
                            <h3 style="color: #2E7D32; margin: 0 0 15px 0; font-size: 18px;">Who We're Looking For:</h3>
                            <ul style="line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li>Motivated individuals interested in the hemp and cannabis wholesale industry.</li>
                                <li>Professional, reliable, and able to maintain compliance with all legal requirements.</li>
                                <li>Great communicators who can build strong relationships with retail buyers.</li>
                                <li>Organized individuals who can track sales activity and follow standard procedures.</li>
                            </ul>
                        </div>
                        
                        <div style="background: white; padding: 25px; margin: 25px 0; border-left: 4px solid #4CAF50; border-radius: 5px;">
                            <h3 style="color: #2E7D32; margin: 0 0 15px 0; font-size: 18px;">What We Offer:</h3>
                            <ul style="line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li>Access to premium hemp-derived products through licensed CHPL holders.</li>
                                <li>A structured sales model with training and compliance support.</li>
                                <li>The ability to earn commissions through brokered wholesale sales.</li>
                                <li>A growing network of industry professionals and opportunities for advancement.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #2E7D32; margin: 0 0 10px 0; font-size: 18px;">Next Steps:</h3>
                            <p style="margin: 0; line-height: 1.6;">If this sounds like an opportunity you'd like to pursue, we'd love to hear from you!</p>
                        </div>
                        
                        <div style="background: #2E7D32; color: white; padding: 25px; text-align: center; border-radius: 8px; margin: 30px 0;">
                            <p style="margin: 0; font-weight: bold; font-size: 16px;">📧 Please reply to this email or contact us at:</p>
                            <p style="margin: 10px 0 0 0; font-size: 20px;"><a href="mailto:greenbridgeagbrokers@gmail.com" style="color: #4CAF50; text-decoration: none;">greenbridgeagbrokers@gmail.com</a></p>
                        </div>
                        
                        <p style="line-height: 1.6; margin-bottom: 20px;">In your message, briefly introduce yourself and explain why you're interested in becoming a Sales Agent with Greenbridge Agriculture Brokerage Co.</p>
                        
                        <p style="line-height: 1.6; font-weight: bold; color: #2E7D32;">We look forward to connecting with motivated individuals who want to be part of the growing hemp brokerage industry.</p>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="margin: 0; color: #666; font-size: 14px;">Best regards,<br>
                            <strong style="color: #2E7D32;">Greenbridge Agriculture Brokerage Co</strong></p>
                        </div>
                    </div>
                    
                    <div style="background: #2E7D32; color: #ccc; padding: 20px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">© 2025 Greenbridge Agriculture Brokerage Co. All rights reserved.</p>
                        <p style="margin: 5px 0 0 0;">This document is confidential and proprietary.</p>
                    </div>
                </div>
            `
        };

        // Send email using SendGrid
        await sgMail.send(msg);

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'Contractor briefing email sent successfully' 
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