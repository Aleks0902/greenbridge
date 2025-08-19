// Simple auto-response for contractor inquiries
function handleContractorInquiry(email, name) {
    // Create the contractor briefing email content
    const briefingContent = `
Dear ${name || 'Potential Sales Agent'},

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
    `;

    // Use EmailJS for simple email sending
    emailjs.send("service_greenbridge", "contractor_template", {
        to_email: email,
        to_name: name,
        message: briefingContent,
        subject: "Sales Agent Opportunity - Greenbridge Agriculture Brokerage Co"
    });
}

// Add to existing form handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const formData = new FormData(this);
            const service = formData.get('service');
            
            if (service === 'contractor') {
                setTimeout(() => {
                    handleContractorInquiry(formData.get('email'), formData.get('name'));
                }, 1000);
            }
        });
    }
});