import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide at least 10 characters detailing your project inquiry.' },
        { status: 400 }
      );
    }

    // In production, this can be integrated into Resend, Postmark, Slack webhooks, or CRM
    // Console log for server tracking
    console.log('[Corabin Contact Inquiry Received]', {
      name,
      email,
      phone,
      company: body.company || 'N/A',
      projectTypes: body.projectTypes || [],
      budget: body.budget || 'Not specified',
      timeline: body.timeline || 'Not specified',
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // Send data to n8n webhook
    try {
      await fetch('https://vnx-souvik.duckdns.org/webhook/novastack-contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company: body.company || 'N/A',
          projectTypes: body.projectTypes || [],
          budget: body.budget || 'Not specified',
          timeline: body.timeline || 'Not specified',
          message,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (webhookError) {
      console.error('[n8n Webhook Error]', webhookError);
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received. A senior partner will be in touch within 24 hours.',
    });
  } catch (error) {
    console.error('[Contact API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error processing contact submission.' },
      { status: 500 }
    );
  }
}
