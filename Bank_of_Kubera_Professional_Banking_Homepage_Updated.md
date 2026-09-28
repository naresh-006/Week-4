# Bank of Kubera
## Professional Banking Homepage Content

> Design direction: Create a polished, realistic banking interface while keeping the implementation a controlled prototype. Do not collect real credentials, connect to real financial services, or process real transactions.

## Header

**K**  
**Bank of Kubera**

- Home
- About Us
- Contact Us
- Online Banking
- Sign In

## Hero Section

# Banking designed around your everyday needs.

Manage your accounts, review your spending, transfer money, and stay informed with a simple and secure digital banking experience.

[Open Online Banking](pages/login.html)

[Explore Services](#services)

A connected banking experience that brings everyday financial activities together in one clear and intuitive place.

## Services

# Everything you need in one banking experience

### Accounts
View checking and savings accounts, monitor balances, and review account activity from one convenient dashboard.

### Transfers
Move money between available accounts through a clear transfer and confirmation experience.

### Bill Pay
Organize and review bill payments through an easy-to-use payment management interface.

### Cards
Manage cards, review card activity, explore benefits, and monitor available credit in one place.

### Loans
Explore personal, home, auto, and education financing information through a structured service experience.

### Investing
Review investment information, explore financial education, and view portfolio-related information.

## Benefits

# Banking that puts clarity first

### Simple Experience
Clear navigation, organized information, and intuitive actions make everyday banking easier to understand.

### Connected Dashboard
View account summaries, recent activity, quick actions, and important notifications from one central location.

### Security-Focused Design
Security settings, login activity, account alerts, and support information are organized in one accessible experience.

### Responsive Access
Use a consistent banking interface across desktop, tablet, and mobile screen sizes.

## Dashboard Preview

# Your financial overview

- Total account balance
- Checking account
- Savings account
- Credit card summary
- Recent transactions
- Transfer action
- Bill payment action
- Security notifications

## Call to Action

# Take control of your everyday banking

Access your accounts, explore services, and manage banking activities through one connected experience.

[Sign In to Online Banking](pages/login.html)

## Footer

- About Us
- Contact Us
- Security Center
- Help & Support
- Privacy
- Terms
- Accessibility

**Business information:** [PLACEHOLDER]

**Copyright:** © 2026 Bank of Kubera. All rights reserved.

---

# Content Changes

## Remove from Main Homepage Marketing

- Educational frontend prototype only
- Fictional banking prototype
- Demo-only data
- Practice a workflow
- Demo access
- Simulation-focused descriptions

## Use Professional Product Language

| Avoid | Use |
|---|---|
| Demo access | Online Banking |
| Demo login | Sign In |
| Demo checking account | Checking Account |
| Transfer simulation | Transfer Money |
| Bill pay simulation | Bill Pay |
| Demo card | Credit Card |
| Educational security flow | Security Center |

## Implementation Boundary

The visible interface may use professional banking language and realistic layouts. Internally:

- Use fictional test credentials only.
- Never collect real customer credentials.
- Do not impersonate a real financial institution.
- Do not connect real banking or payment APIs.
- Keep balances, transactions, cards, loans, and investments as test data.
- Keep a discreet prototype notice in the footer, About page, or project documentation.
- Never claim that a real financial transaction has occurred.

## Visual Direction

- Professional banking dashboard
- White or soft neutral background
- Deep navy or charcoal primary color
- Restrained accent color
- Professional cards
- Clear typography
- Consistent spacing
- Subtle shadows
- Meaningful financial icons
- Responsive desktop, tablet, and mobile layouts

## Homepage Structure

```text
Header
  ↓
Hero Section
  ↓
Services
  ↓
Benefits
  ↓
Dashboard Preview
  ↓
Call to Action
  ↓
Footer
```

## Main Objective

The homepage should communicate the value of a banking product first. It should look like a polished banking application rather than a tutorial or classroom exercise.

---

# Creative Banking UI Enhancements

The website should not depend only on text-based service cards. Each major banking option should have a meaningful visual component that makes the interface feel like a modern digital banking product.

## Service Card Visual System

Each service card should include:

- A clear service icon or custom illustration.
- A short professional description.
- A visual preview related to the service.
- A primary action such as **Explore**, **View Details**, or **Manage**.
- A subtle hover animation.
- Consistent card spacing, rounded corners, and soft shadows.
- Responsive behavior for desktop, tablet, and mobile screens.

### Recommended Service Visuals

| Service | Creative Visual |
|---|---|
| Accounts | Mini balance chart, account wallet illustration, or checking and savings summary |
| Transfers | Animated money-flow illustration between two account cards |
| Bill Pay | Bill document, calendar, and payment confirmation visual |
| Credit Cards | Designed credit card preview with chip, card number, cardholder, and expiry |
| Loans | Home, vehicle, education, or personal-finance illustration |
| Investing | Portfolio performance chart with rising and falling data points |
| Security Center | Shield, lock, biometric, and security-alert illustration |

---

# Credit Cards: Creative UI Specification

## Credit Card Service Card

When the user selects or views the **Credit Cards** option, the interface should display a professionally designed visual credit card instead of a plain text-only section.

The card should look like a modern banking product while clearly using fictional sample information.

### Credit Card Visual Elements

The visual credit card should include:

- Bank branding: **Bank of Kubera**
- A fictional cardholder name
- Masked sample card number
- Expiry date
- Card chip
- Contactless payment symbol
- Card network label such as **KUBERA**
- Elegant background gradient or abstract geometric pattern
- A subtle gloss, glow, or layered shadow effect
- Optional card color themes such as:
  - Midnight Navy
  - Royal Purple
  - Emerald Green
  - Platinum Silver

### Sample Credit Card Layout

```text
┌──────────────────────────────────────────────┐
│ BANK OF KUBERA                    ◉          │
│                                              │
│                 [ CHIP ]     ))              │
│                                              │
│        ••••  ••••  ••••  4821                │
│                                              │
│ CARDHOLDER NAME              VALID THRU      │
│ NARESH KUMAR                 09/30           │
│                                              │
│                                  KUBERA       │
└──────────────────────────────────────────────┘
```

> The displayed card number, name, and expiry date must be fictional sample values. Never request, store, or display real card credentials.

## Credit Card Section Layout

The Credit Cards page or dashboard section should contain:

### 1. Featured Card Preview

A large visual card positioned at the center or left side of the section.

Suggested information:

- Card name: **Kubera Signature Card**
- Available credit
- Current balance
- Payment due date
- Minimum payment
- Reward points

Example:

```text
Kubera Signature Card

Available Credit       ₹85,000
Current Balance        ₹15,240
Payment Due            18 October
Reward Points          2,480
```

### 2. Card Actions

Use visually clear action buttons:

- **View Card Details**
- **Manage Card**
- **Freeze Card**
- **Payment History**
- **Set Spending Limit**
- **Replace Card**

These actions should update the interface state only. They must not connect to real banking systems or perform real card operations.

### 3. Card Benefits

Show benefits in small visual cards:

- Reward points
- Contactless payments
- Spending insights
- Payment reminders
- Security alerts
- Flexible card controls

### 4. Spending Overview

Include a creative spending visualization such as:

- Monthly spending progress bar
- Category breakdown
- Recent card transactions
- Spending limit indicator
- Simple bar chart or doughnut chart

Suggested categories:

- Shopping
- Food and Dining
- Travel
- Utilities
- Entertainment

## Credit Card Interaction Design

The credit card visual should support the following frontend interactions:

| Interaction | Expected UI Behavior |
|---|---|
| Hover over card | Slight lift, shadow enhancement, or subtle tilt |
| Click card | Open card details panel |
| View Card Details | Display expanded card information |
| Freeze Card | Change status to “Card Frozen” in the UI |
| Unfreeze Card | Restore status to “Card Active” |
| Change Theme | Apply a different fictional card color |
| Payment History | Display sample card transactions |
| Set Spending Limit | Open a frontend form and show the updated sample limit |
| Mobile view | Stack card preview and card details vertically |

## Suggested HTML Structure

```html
<section class="credit-card-section" aria-labelledby="credit-card-title">
  <div class="credit-card-intro">
    <span class="section-label">Credit Cards</span>
    <h2 id="credit-card-title">A card designed around your lifestyle</h2>
    <p>
      Manage your card preferences, review spending, and explore available
      card benefits from one connected experience.
    </p>
  </div>

  <div class="credit-card-layout">
    <article class="credit-card-preview">
      <div class="credit-card-brand">BANK OF KUBERA</div>
      <div class="credit-card-chip" aria-hidden="true"></div>
      <div class="credit-card-contactless" aria-hidden="true">)))</div>
      <div class="credit-card-number">•••• •••• •••• 4821</div>

      <div class="credit-card-footer">
        <div>
          <span>Cardholder</span>
          <strong>NARESH KUMAR</strong>
        </div>
        <div>
          <span>Valid Thru</span>
          <strong>09/30</strong>
        </div>
        <strong class="credit-card-network">KUBERA</strong>
      </div>
    </article>

    <div class="credit-card-summary">
      <h3>Kubera Signature Card</h3>
      <p>Premium everyday spending and card management.</p>

      <div class="credit-card-metrics">
        <div>
          <span>Available Credit</span>
          <strong>₹85,000</strong>
        </div>
        <div>
          <span>Current Balance</span>
          <strong>₹15,240</strong>
        </div>
        <div>
          <span>Payment Due</span>
          <strong>18 October</strong>
        </div>
      </div>

      <div class="credit-card-actions">
        <button type="button">View Details</button>
        <button type="button">Manage Card</button>
        <button type="button">Freeze Card</button>
      </div>
    </div>
  </div>
</section>
```

## Suggested CSS Direction

```css
.credit-card-preview {
  position: relative;
  min-height: 260px;
  padding: 28px;
  border-radius: 24px;
  color: #ffffff;
  background:
    radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.22), transparent 28%),
    linear-gradient(135deg, #111827, #243b64 55%, #5b3f8c);
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.24);
  overflow: hidden;
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.credit-card-preview::after {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  right: -90px;
  bottom: -110px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
}

.credit-card-preview:hover {
  transform: translateY(-6px) rotateX(1deg) rotateY(-1deg);
  box-shadow: 0 32px 64px rgba(15, 23, 42, 0.3);
}

.credit-card-chip {
  width: 48px;
  height: 36px;
  margin-top: 42px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f4d58d, #b88a3b);
}

.credit-card-number {
  margin-top: 28px;
  font-size: clamp(1rem, 2vw, 1.35rem);
  letter-spacing: 0.16em;
  font-variant-numeric: tabular-nums;
}

.credit-card-footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
}

.credit-card-footer span {
  display: block;
  margin-bottom: 6px;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.72;
}

.credit-card-footer strong {
  font-size: 0.82rem;
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .credit-card-layout {
    display: grid;
    gap: 24px;
  }

  .credit-card-preview {
    min-height: 220px;
    padding: 22px;
  }

  .credit-card-footer {
    flex-wrap: wrap;
  }

  .credit-card-actions {
    display: grid;
    gap: 10px;
  }
}
```

## Credit Card Design Quality Requirements

The credit card visual should:

- Look like a premium banking interface, not a basic classroom card.
- Use layered gradients, subtle patterns, and realistic spacing.
- Maintain strong contrast and readable text.
- Include hover and focus states.
- Avoid excessive animation that harms usability.
- Support keyboard navigation.
- Use `aria-label`, visible focus styles, and meaningful button text.
- Remain visually attractive without relying on external images.
- Use CSS shapes, gradients, SVG icons, or locally created illustrations when possible.
- Never use real card numbers, real customer names, or real payment information.

---

# Updated Homepage Service Presentation

The homepage service cards should use a mixed visual layout rather than six identical text boxes.

```text
Services
│
├── Accounts
│   └── Balance preview + mini chart
│
├── Transfers
│   └── Account-to-account money flow illustration
│
├── Bill Pay
│   └── Bill document + calendar visual
│
├── Credit Cards
│   └── Interactive designed credit card preview
│
├── Loans
│   └── Finance category illustration
│
└── Investing
    └── Portfolio performance chart
```

The Credit Cards service card should be visually prominent because the designed card preview provides an immediate understanding of the service.

## Updated Homepage Credit Card Copy

### Credit Cards

**Designed for the way you spend**

Explore card controls, review spending activity, monitor available credit, and discover benefits through a polished card management experience.

**Primary action:** `Explore Credit Cards`

**Visual:** Interactive fictional Bank of Kubera credit card preview.

---

# Recommended Visual Style

The overall application should use a creative but trustworthy banking visual language:

- Deep navy, graphite, white, and muted gold as the primary palette.
- One accent color per product area.
- Soft gradient backgrounds for featured cards.
- Rounded cards with consistent corner radius.
- Subtle glass-like overlays only where they improve hierarchy.
- Small motion effects for hover, focus, and transitions.
- Charts and illustrations that explain financial information visually.
- Clear spacing between content, actions, and metrics.
- Professional typography with strong heading hierarchy.
- Mobile-first responsive layout.

The goal is to make the application feel like a modern premium banking platform while keeping all data and actions within the controlled frontend environment.
