---
title: Bank of Kubera - Phase-by-Phase Implementation Plan
project: Bank of Kubera
technology: HTML, Material UI, JavaScript
scope: Frontend-only educational banking prototype
---

# Bank of Kubera
## Phase-by-Phase Implementation Plan

## Project Scope

Bank of Kubera is a fictional, educational, frontend-only banking website.

### Technology

- HTML
- Material UI
- JavaScript

### Important Boundaries

- No backend
- No database
- No real banking APIs
- No real financial transactions
- No real customer credentials
- No real customer information
- Fictional and demo data only
- Simulated login, transfers, bill payments, security, and logout

---

# Development Strategy

The project will be implemented in phases.

Each phase should follow this cycle:

```text
Understand Requirements
        ↓
Create Components
        ↓
Implement Functionality
        ↓
Test the Phase
        ↓
Fix Errors
        ↓
Mark Phase Complete
        ↓
Move to Next Phase
```

## Phase Completion Rule

Do not move to the next phase until:

- The current phase runs without major errors.
- The page is responsive.
- The components are reusable where appropriate.
- The UI follows the Bank of Kubera design system.
- Demo data is clearly separated from real information.
- The functionality is tested manually.

---

# Phase 0: Project Planning and Environment Setup

## Objective

Prepare the development environment and finalize the initial project structure.

## Tasks

- [ ] Confirm the project name: Bank of Kubera.
- [ ] Confirm the technology stack: HTML, Material UI, JavaScript.
- [ ] Create the project folder.
- [ ] Select the development environment.
- [ ] Prepare the initial HTML entry point.
- [ ] Decide whether the project uses a simple multi-page structure or a JavaScript-driven page structure.
- [ ] Prepare the assets folder.
- [ ] Create a basic README file.
- [ ] Add the frontend-only disclaimer.

## Suggested Initial Structure

```text
bank-of-kubera/
├── index.html
├── pages/
├── css/
├── js/
├── assets/
└── data/
```

## Expected Result

A clean project folder that can be opened and developed locally.

## Testing Checklist

- [ ] Project folder opens correctly.
- [ ] Initial HTML page loads.
- [ ] No missing file errors.
- [ ] Browser developer console is checked.

---

# Phase 1: Base HTML Structure and Design Foundation

## Objective

Create the basic page structure and establish the visual foundation.

## Tasks

- [ ] Create the main HTML structure.
- [ ] Add semantic HTML elements.
- [ ] Define the main application container.
- [ ] Create the header placeholder.
- [ ] Create the sidebar placeholder.
- [ ] Create the main content placeholder.
- [ ] Create the footer placeholder.
- [ ] Add global CSS or Material UI styling.
- [ ] Establish typography.
- [ ] Establish spacing.
- [ ] Establish color variables.
- [ ] Establish button styles.
- [ ] Establish card styles.

## Suggested Structure

```text
Application
├── Header
├── Sidebar
├── Main Content
└── Footer
```

## Expected Result

A basic Bank of Kubera layout with an empty but properly aligned application shell.

## Testing Checklist

- [ ] Header is visible.
- [ ] Sidebar is visible.
- [ ] Main content area is visible.
- [ ] Footer is visible.
- [ ] Typography is readable.
- [ ] Layout does not overflow horizontally.

---

# Phase 2: Branding and Reusable UI Components

## Objective

Create reusable components that will be used across the website.

## Components

### Global Components

- [ ] Logo
- [ ] Header
- [ ] Sidebar
- [ ] Footer
- [ ] Button
- [ ] Card
- [ ] Form Field
- [ ] Breadcrumb
- [ ] Search Input
- [ ] Profile Menu
- [ ] Modal
- [ ] Notification
- [ ] Status Message

### State Components

- [ ] Loading State
- [ ] Empty State
- [ ] Error Message
- [ ] Success Message
- [ ] Validation Message

## Tasks

- [ ] Create the Bank of Kubera logo treatment.
- [ ] Create consistent buttons.
- [ ] Create consistent cards.
- [ ] Create reusable form fields.
- [ ] Create reusable status messages.
- [ ] Create reusable dialog or modal styling.
- [ ] Ensure components have accessible labels.
- [ ] Ensure components work on smaller screens.

## Expected Result

A small reusable component library that prevents repeated UI code.

## Testing Checklist

- [ ] Components display consistently.
- [ ] Buttons have visible hover and focus states.
- [ ] Form fields have labels.
- [ ] Modal opens and closes correctly.
- [ ] Status messages are readable.

---

# Phase 3: Responsive Application Shell

## Objective

Complete the shared application shell for desktop, tablet, and mobile.

## Header Features

- [ ] Bank of Kubera logo.
- [ ] Bank name.
- [ ] Search input.
- [ ] Profile menu.
- [ ] Support link.
- [ ] Security link where appropriate.
- [ ] Mobile menu button.

## Sidebar Features

- [ ] Dashboard.
- [ ] Accounts.
- [ ] Transfers.
- [ ] Bill Pay.
- [ ] Transactions.
- [ ] Credit Cards.
- [ ] Loans.
- [ ] Investing.
- [ ] Profile.
- [ ] Settings.
- [ ] Security.
- [ ] Help & Support.
- [ ] Logout.

## Responsive Behavior

### Desktop

- Full sidebar.
- Full header.
- Multi-column content.
- Detailed tables.

### Tablet

- Adaptive sidebar.
- Flexible cards.
- Reduced spacing.
- Simplified navigation where needed.

### Mobile

- Collapsible sidebar.
- Single-column cards.
- Stacked forms.
- Touch-friendly buttons.
- Responsive transaction lists.

## Expected Result

A consistent shell that can be reused across authenticated pages.

## Testing Checklist

- [ ] Desktop layout works.
- [ ] Tablet layout works.
- [ ] Mobile layout works.
- [ ] Sidebar opens and closes on mobile.
- [ ] Header elements do not overlap.
- [ ] Content remains readable.

---

# Phase 4: Public Pages

## Objective

Build the pages that users can view before entering the demo application.

## Pages

- [ ] Home
- [ ] About Us
- [ ] Contact Us

## Home Page

### Components

- [ ] Hero section.
- [ ] Bank of Kubera introduction.
- [ ] Banking service cards.
- [ ] Features section.
- [ ] Demo login CTA.
- [ ] Footer.

### Actions

- [ ] Open demo login.
- [ ] Navigate to About Us.
- [ ] Navigate to Contact Us.
- [ ] Explore service information.

## About Us

### Components

- [ ] Fictional mission.
- [ ] Fictional values.
- [ ] Educational prototype disclaimer.
- [ ] Placeholder business information.

## Contact Us

### Components

- [ ] Name field.
- [ ] Email field.
- [ ] Subject field.
- [ ] Message field.
- [ ] Submit button.
- [ ] Validation messages.
- [ ] Simulated success message.

## Important

The Contact Us page must not send information to a real support system.

## Expected Result

A professional public-facing website experience.

## Testing Checklist

- [ ] Public navigation works.
- [ ] CTA buttons work.
- [ ] Contact form validates fields.
- [ ] Success message appears only after valid demo submission.
- [ ] Footer links work or display appropriate placeholders.

---

# Phase 5: Demo Login and Frontend Session

## Objective

Create a clearly labeled simulated login flow.

## Login Flow

```text
Login Page
    ↓
Enter Demo ID and Password
    ↓
JavaScript Validation
    ↓
Fixed Demo Credential Check
    ├── Invalid → Error Message
    └── Valid → Demo Session → Dashboard
```

## Tasks

- [ ] Create login page.
- [ ] Add demo ID input.
- [ ] Add password input.
- [ ] Add show/hide password UI.
- [ ] Add validation.
- [ ] Define fixed fictional demo credentials.
- [ ] Display a demo-only notice.
- [ ] Create simulated session state.
- [ ] Redirect to Dashboard after valid demo login.
- [ ] Prevent access to protected demo pages without a session.
- [ ] Add logout session clearing.

## Security Boundary

- [ ] Do not use real credentials.
- [ ] Do not claim that the login is secure authentication.
- [ ] Do not store sensitive information.
- [ ] Clearly label the login as a simulation.

## Expected Result

A functional demo login that opens the Dashboard using fictional credentials.

## Testing Checklist

- [ ] Empty fields show validation messages.
- [ ] Invalid demo credentials show an error.
- [ ] Valid demo credentials open Dashboard.
- [ ] Demo session is recognized.
- [ ] Logout clears the demo session.
- [ ] Protected demo pages redirect to login when no session exists.

---

# Phase 6: Demo Data Architecture

## Objective

Create organized fictional data for the banking pages.

## Data Categories

- [ ] Demo customer.
- [ ] Demo accounts.
- [ ] Demo transactions.
- [ ] Demo cards.
- [ ] Demo billers.
- [ ] Demo loans.
- [ ] Demo investments.
- [ ] Demo notifications.
- [ ] Demo login activity.

## Suggested Data Files

```text
data/
├── demo-user.json
├── demo-accounts.json
├── demo-transactions.json
├── demo-cards.json
├── demo-billers.json
├── demo-loans.json
├── demo-investments.json
└── demo-notifications.json
```

## Example Account Data

```json
{
  "id": "account-001",
  "type": "Checking",
  "name": "Demo Checking Account",
  "maskedNumber": "****1234",
  "balance": 25000,
  "availableBalance": 23500,
  "currency": "DEMO"
}
```

## Rules

- [ ] Use fictional account identifiers.
- [ ] Use masked account numbers.
- [ ] Clearly label demo values.
- [ ] Keep data separate from UI components.
- [ ] Never include real customer information.

## Expected Result

All major pages can display consistent fictional data.

## Testing Checklist

- [ ] Data loads correctly.
- [ ] Missing values are handled.
- [ ] Empty arrays display an empty state.
- [ ] Demo labels are visible where appropriate.

---

# Phase 7: Dashboard

## Objective

Build the main landing page after demo login.

## Components

- [ ] Welcome section.
- [ ] Demo account summary.
- [ ] Checking account card.
- [ ] Savings account card.
- [ ] Credit card summary.
- [ ] Quick actions.
- [ ] Recent transactions.
- [ ] Financial overview.
- [ ] Notifications.
- [ ] Security reminder.

## Quick Actions

- [ ] Transfer Money.
- [ ] Pay Bill.
- [ ] View Transactions.
- [ ] Manage Cards.

## Tasks

- [ ] Connect account cards to demo data.
- [ ] Display masked account numbers.
- [ ] Display fictional balances.
- [ ] Display recent demo transactions.
- [ ] Add navigation to related pages.
- [ ] Add empty and error states.
- [ ] Add responsive dashboard layout.

## Expected Result

A complete Dashboard that summarizes the demo customer's fictional banking information.

## Testing Checklist

- [ ] All cards display correctly.
- [ ] Quick actions navigate correctly.
- [ ] Recent transactions display.
- [ ] Dashboard is responsive.
- [ ] Empty states work.
- [ ] Demo data disclaimer is visible.

---

# Phase 8: Accounts and Account Details

## Objective

Allow users to view fictional accounts and their details.

## Accounts Page

### Components

- [ ] Account cards.
- [ ] Checking account.
- [ ] Savings account.
- [ ] Balance.
- [ ] Available balance.
- [ ] Masked account number.
- [ ] View Details button.

## Account Details Page

### Components

- [ ] Account information.
- [ ] Balance summary.
- [ ] Transaction list.
- [ ] Search.
- [ ] Date filter.
- [ ] Transaction type filter.
- [ ] Statement/download placeholder.
- [ ] Transaction details dialog.

## Tasks

- [ ] Display all demo accounts.
- [ ] Open a selected account.
- [ ] Display account-specific transactions.
- [ ] Implement local search.
- [ ] Implement local filters.
- [ ] Handle no matching transactions.
- [ ] Add a statement UI placeholder without generating real statements.

## Expected Result

Users can navigate from an account card to its fictional account details.

## Testing Checklist

- [ ] Account selection works.
- [ ] Correct account details display.
- [ ] Search works.
- [ ] Filters work.
- [ ] Empty results are handled.
- [ ] Back navigation works.

---

# Phase 9: Transaction History

## Objective

Create a complete demo transaction history experience.

## Components

- [ ] Search input.
- [ ] Account filter.
- [ ] Date filter.
- [ ] Transaction type filter.
- [ ] Transaction table or list.
- [ ] Transaction details dialog.
- [ ] Empty state.
- [ ] Error state.

## Transaction Fields

- [ ] Date.
- [ ] Description.
- [ ] Category.
- [ ] Debit.
- [ ] Credit.
- [ ] Balance.

## Tasks

- [ ] Display transaction data.
- [ ] Search by description.
- [ ] Filter by account.
- [ ] Filter by date.
- [ ] Filter by transaction type.
- [ ] Open transaction details.
- [ ] Create a mobile-friendly transaction list.
- [ ] Display demo-data messaging.

## Expected Result

A searchable and filterable fictional transaction history page.

## Testing Checklist

- [ ] Search works.
- [ ] Each filter works.
- [ ] Multiple filters work together.
- [ ] No-results state works.
- [ ] Transaction details open correctly.
- [ ] Mobile layout is readable.

---

# Phase 10: Money Transfer

## Objective

Create a simulated transfer workflow without moving real funds.

## Transfer Flow

```text
Transfer Form
    ↓
JavaScript Validation
    ↓
Review Transfer
    ↓
Confirmation
    ↓
Simulated Success Message
```

## Fields

- [ ] From account.
- [ ] To account.
- [ ] Amount.
- [ ] Date.
- [ ] Description.

## Tasks

- [ ] Create transfer form.
- [ ] Load demo accounts into selectors.
- [ ] Validate required fields.
- [ ] Validate amount format.
- [ ] Prevent invalid or empty values.
- [ ] Display review screen.
- [ ] Display confirmation dialog.
- [ ] Display simulated success message.
- [ ] Do not actually transfer funds.
- [ ] Clearly label the process as a simulation.

## Suggested State

```text
form
review
confirmation
success
error
```

## Expected Result

A complete simulated transfer journey.

## Testing Checklist

- [ ] Required fields validate.
- [ ] Invalid amount is rejected.
- [ ] Review screen shows entered demo information.
- [ ] Confirmation opens.
- [ ] Success message appears after confirmation.
- [ ] No real transaction occurs.

---

# Phase 11: Bill Payment

## Objective

Create a simulated bill payment workflow using fictional billers.

## Bill Payment Flow

```text
Select Fictional Biller
    ↓
Enter Payment Details
    ↓
Review
    ↓
Confirmation
    ↓
Simulated Success
```

## Components

- [ ] Biller selector.
- [ ] Payment amount.
- [ ] Due-date display.
- [ ] Payment description.
- [ ] Review panel.
- [ ] Confirmation dialog.
- [ ] Success message.

## Tasks

- [ ] Create fictional billers.
- [ ] Display biller details.
- [ ] Validate amount.
- [ ] Validate required fields.
- [ ] Create review screen.
- [ ] Create confirmation screen.
- [ ] Display simulated result.
- [ ] Do not connect to real billers or payment systems.

## Expected Result

A complete fictional bill payment demonstration.

## Testing Checklist

- [ ] Biller selection works.
- [ ] Required fields validate.
- [ ] Review information is correct.
- [ ] Confirmation works.
- [ ] Success and error states display correctly.
- [ ] No real payment is processed.

---

# Phase 12: Credit Cards

## Objective

Build a fictional credit card management page.

## Components

- [ ] Card showcase.
- [ ] Card name.
- [ ] Masked card number.
- [ ] Benefits.
- [ ] Rewards.
- [ ] Features.
- [ ] Current balance.
- [ ] Available credit.
- [ ] Payment due.
- [ ] Recent transactions.

## Tasks

- [ ] Load demo card data.
- [ ] Display card designs.
- [ ] Display fictional balances.
- [ ] Display benefits and rewards.
- [ ] Display recent demo transactions.
- [ ] Add card detail view.
- [ ] Add simulated payment UI if required.
- [ ] Clearly label all actions as demonstrations.

## Expected Result

A professional credit card page using fictional card data.

## Testing Checklist

- [ ] Card information displays.
- [ ] Masked values are used.
- [ ] Card details work.
- [ ] Responsive card layout works.
- [ ] No real card details are requested.

---

# Phase 13: Loans

## Objective

Create an educational loan information page without real loan processing.

## Loan Categories

- [ ] Personal loan.
- [ ] Home loan.
- [ ] Auto loan.
- [ ] Education-related financing.

## Components

- [ ] Loan cards.
- [ ] Description.
- [ ] Features.
- [ ] Educational information.
- [ ] Learn More button.
- [ ] Information dialog.

## Tasks

- [ ] Create fictional loan categories.
- [ ] Display educational content.
- [ ] Add Learn More interactions.
- [ ] Add informational dialogs.
- [ ] Avoid loan applications.
- [ ] Avoid approval or underwriting functionality.
- [ ] Avoid real financial advice claims.

## Expected Result

A clean educational loan information section.

## Testing Checklist

- [ ] Loan cards display.
- [ ] Learn More works.
- [ ] Dialogs close correctly.
- [ ] No real loan processing is implied.

---

# Phase 14: Investing

## Objective

Create an educational investing dashboard with fictional values.

## Components

- [ ] Investment overview.
- [ ] Educational sections.
- [ ] Investment categories.
- [ ] Demo portfolio.
- [ ] Portfolio summary.
- [ ] Fictional allocation display.
- [ ] Informational cards.

## Tasks

- [ ] Create demo portfolio data.
- [ ] Display fictional portfolio values.
- [ ] Create educational descriptions.
- [ ] Add category cards.
- [ ] Add a demo portfolio summary.
- [ ] Clearly label values as fictional.
- [ ] Do not connect to real markets or brokerage services.

## Expected Result

An educational investing interface with no real investment activity.

## Testing Checklist

- [ ] Portfolio data displays.
- [ ] Categories display.
- [ ] Fictional values are labeled.
- [ ] Responsive layout works.
- [ ] No real investment action is performed.

---

# Phase 15: Profile and Settings

## Objective

Create profile management and preference interfaces using placeholders.

## Profile Page

### Fields

- [ ] Name.
- [ ] Email.
- [ ] Phone.
- [ ] Address.

### Actions

- [ ] Edit.
- [ ] Save.
- [ ] Cancel.

## Settings Page

### Sections

- [ ] Account settings.
- [ ] Communication preferences.
- [ ] Notification settings.
- [ ] Security settings.

## Tasks

- [ ] Use placeholder customer information.
- [ ] Create editable fields.
- [ ] Validate profile fields.
- [ ] Implement simulated save.
- [ ] Implement cancel/reset behavior.
- [ ] Create preference toggles.
- [ ] Display simulated saved-state feedback.

## Expected Result

Users can edit fictional profile information and preferences locally.

## Testing Checklist

- [ ] Edit mode works.
- [ ] Save validation works.
- [ ] Cancel works.
- [ ] Preferences update visually.
- [ ] Placeholder information is used.
- [ ] No real user data is collected.

---

# Phase 16: Security Page

## Objective

Create a simulated security and awareness page.

## Components

- [ ] Secure login information.
- [ ] Password safety section.
- [ ] Two-factor authentication UI.
- [ ] Login activity.
- [ ] Fraud awareness.
- [ ] Security support.

## Tasks

- [ ] Display password safety guidance.
- [ ] Display simulated two-factor authentication controls.
- [ ] Display fictional login activity.
- [ ] Add fraud awareness information.
- [ ] Add security support navigation.
- [ ] Clearly mark simulated interactions.
- [ ] Do not claim to enable real security controls.

## Expected Result

A security awareness page that demonstrates banking UI concepts.

## Testing Checklist

- [ ] Security sections display.
- [ ] Simulated controls work visually.
- [ ] Login activity uses demo data.
- [ ] Security disclaimer is visible.
- [ ] No real security setting is changed.

---

# Phase 17: Help and Support

## Objective

Create a searchable help and support experience.

## Categories

- [ ] Login help.
- [ ] Account help.
- [ ] Payment help.
- [ ] Card help.
- [ ] Security help.
- [ ] Contact support.

## Components

- [ ] Help search.
- [ ] FAQ list.
- [ ] Expandable FAQ items.
- [ ] Category cards.
- [ ] Contact support CTA.
- [ ] No-results state.

## Tasks

- [ ] Create fictional FAQ content.
- [ ] Implement local help search.
- [ ] Categorize help topics.
- [ ] Add expandable answers.
- [ ] Add Contact Us navigation.
- [ ] Handle no search results.

## Expected Result

Users can search and browse help content locally.

## Testing Checklist

- [ ] Search works.
- [ ] FAQ items expand and collapse.
- [ ] Categories navigate correctly.
- [ ] No-results state works.
- [ ] Mobile layout works.

---

# Phase 18: Global Search

## Objective

Implement search across the demo application.

## Search Categories

- [ ] Accounts.
- [ ] Cards.
- [ ] Loans.
- [ ] Transfers.
- [ ] Security.
- [ ] Help.

## Search Flow

```text
Search Input
    ↓
JavaScript Search
    ↓
Categorized Results
    ↓
Select Result
    ↓
Navigate to Relevant Page
```

## Tasks

- [ ] Create global search input.
- [ ] Define searchable demo records.
- [ ] Implement case-insensitive search.
- [ ] Categorize results.
- [ ] Display no-results state.
- [ ] Navigate to selected result.
- [ ] Support keyboard accessibility where possible.

## Expected Result

A global search feature that navigates to relevant fictional pages.

## Testing Checklist

- [ ] Search finds relevant items.
- [ ] Search handles empty input.
- [ ] Search handles no results.
- [ ] Results are categorized.
- [ ] Selecting a result navigates correctly.

---

# Phase 19: Logout and Session Clearing

## Objective

Complete the simulated logout flow.

## Logout Flow

```text
Logout
    ↓
Confirmation Modal
    ↓
Clear Demo Session
    ↓
Login Page
```

## Tasks

- [ ] Add Logout to the sidebar or profile menu.
- [ ] Display confirmation modal.
- [ ] Provide Cancel action.
- [ ] Provide Confirm Logout action.
- [ ] Clear demo session state.
- [ ] Redirect to login.
- [ ] Prevent access to protected demo pages after logout.

## Expected Result

A complete simulated logout flow.

## Testing Checklist

- [ ] Logout modal opens.
- [ ] Cancel keeps the user in the application.
- [ ] Confirm clears the demo session.
- [ ] Login page opens.
- [ ] Protected pages cannot be accessed without a demo session.

---

# Phase 20: UI State Handling

## Objective

Ensure every major interactive feature supports consistent UI states.

## Required States

```text
Default
   ↓
Loading
   ├── Success
   ├── Error
   └── Empty
```

## Apply States To

- [ ] Dashboard data.
- [ ] Account data.
- [ ] Transaction list.
- [ ] Search.
- [ ] Transfers.
- [ ] Bill payments.
- [ ] Profile save.
- [ ] Contact form.
- [ ] Help search.

## Tasks

- [ ] Create reusable loading state.
- [ ] Create reusable empty state.
- [ ] Create reusable error message.
- [ ] Create reusable success message.
- [ ] Create reusable validation message.
- [ ] Ensure state transitions are understandable.
- [ ] Ensure status messages are accessible.

## Expected Result

The interface remains clear even when there is no data or an action fails.

---

# Phase 21: Accessibility and Usability

## Objective

Improve usability and accessibility across the website.

## Checklist

- [ ] Use semantic HTML.
- [ ] Add labels to form fields.
- [ ] Provide useful alternative text for meaningful images.
- [ ] Ensure keyboard navigation.
- [ ] Ensure visible focus indicators.
- [ ] Use readable text sizes.
- [ ] Maintain adequate color contrast.
- [ ] Do not rely only on color to communicate status.
- [ ] Provide accessible dialog behavior.
- [ ] Use clear error messages.
- [ ] Ensure buttons have understandable labels.
- [ ] Ensure mobile controls are touch-friendly.

## Expected Result

A more usable and accessible frontend experience.

---

# Phase 22: Responsive Testing

## Objective

Test all pages across different screen sizes.

## Desktop Testing

- [ ] Home.
- [ ] Login.
- [ ] Dashboard.
- [ ] Accounts.
- [ ] Transfers.
- [ ] Bill Pay.
- [ ] Transactions.
- [ ] Cards.
- [ ] Loans.
- [ ] Investing.
- [ ] Profile.
- [ ] Settings.
- [ ] Security.
- [ ] Help.

## Tablet Testing

- [ ] Sidebar behavior.
- [ ] Card layout.
- [ ] Form layout.
- [ ] Table/list behavior.
- [ ] Header alignment.

## Mobile Testing

- [ ] Menu opening and closing.
- [ ] Single-column layout.
- [ ] Stacked forms.
- [ ] Responsive transaction list.
- [ ] Button size.
- [ ] Dialog size.
- [ ] Text wrapping.
- [ ] Horizontal overflow.

## Expected Result

The website works consistently across desktop, tablet, and mobile.

---

# Phase 23: Final Integration

## Objective

Connect all completed pages into one consistent application.

## Tasks

- [ ] Connect public navigation.
- [ ] Connect login to Dashboard.
- [ ] Connect Dashboard quick actions.
- [ ] Connect sidebar navigation.
- [ ] Connect account cards to Account Details.
- [ ] Connect transfer review and confirmation.
- [ ] Connect bill payment review and confirmation.
- [ ] Connect profile and settings.
- [ ] Connect Help and Contact pages.
- [ ] Connect Logout.
- [ ] Verify all links.
- [ ] Verify all buttons.
- [ ] Verify all forms.
- [ ] Verify demo session behavior.

## Expected Result

A connected Bank of Kubera frontend prototype.

---

# Phase 24: Final Quality Assurance

## Functional Testing

- [ ] Home navigation works.
- [ ] Login validation works.
- [ ] Dashboard loads.
- [ ] Accounts display.
- [ ] Account Details works.
- [ ] Transaction search works.
- [ ] Transaction filters work.
- [ ] Transfer flow works.
- [ ] Bill Pay flow works.
- [ ] Credit Cards page works.
- [ ] Loans page works.
- [ ] Investing page works.
- [ ] Profile editing works.
- [ ] Settings interactions work.
- [ ] Security page works.
- [ ] Help search works.
- [ ] Contact form works.
- [ ] Logout works.

## Visual Testing

- [ ] Typography is consistent.
- [ ] Spacing is consistent.
- [ ] Cards are consistent.
- [ ] Buttons are consistent.
- [ ] Colors are consistent.
- [ ] Icons are meaningful.
- [ ] Status messages are clear.
- [ ] No page looks disconnected from the application.

## Boundary Testing

- [ ] No backend is introduced.
- [ ] No database is introduced.
- [ ] No real banking API is introduced.
- [ ] No real credentials are requested.
- [ ] No real transactions are processed.
- [ ] No real customer information is used.
- [ ] Demo values are clearly identified.

---

# Recommended Implementation Order

The recommended order is:

```text
Phase 0  → Project Setup
Phase 1  → Base HTML and Design Foundation
Phase 2  → Reusable Components
Phase 3  → Responsive Application Shell
Phase 4  → Public Pages
Phase 5  → Demo Login
Phase 6  → Demo Data
Phase 7  → Dashboard
Phase 8  → Accounts and Account Details
Phase 9  → Transaction History
Phase 10 → Money Transfer
Phase 11 → Bill Payment
Phase 12 → Credit Cards
Phase 13 → Loans
Phase 14 → Investing
Phase 15 → Profile and Settings
Phase 16 → Security
Phase 17 → Help and Support
Phase 18 → Global Search
Phase 19 → Logout
Phase 20 → UI States
Phase 21 → Accessibility
Phase 22 → Responsive Testing
Phase 23 → Final Integration
Phase 24 → Quality Assurance
```

---

# Suggested First Milestone

## Milestone 1: Foundation

Complete:

- [ ] Phase 0: Project Setup
- [ ] Phase 1: Base HTML Structure
- [ ] Phase 2: Reusable Components
- [ ] Phase 3: Responsive Application Shell

### Milestone 1 Result

You should have:

- A working Bank of Kubera project.
- A professional header.
- A responsive sidebar.
- A main content area.
- A footer.
- Reusable buttons and cards.
- A consistent design foundation.

Do not start the full banking functionality until the foundation is stable.

---

# Suggested Second Milestone

## Milestone 2: Entry and Overview

Complete:

- [ ] Phase 4: Public Pages
- [ ] Phase 5: Demo Login
- [ ] Phase 6: Demo Data
- [ ] Phase 7: Dashboard

### Milestone 2 Result

You should have:

```text
Home
  ↓
Demo Login
  ↓
Dashboard
```

The user can enter fictional demo credentials and view a Dashboard populated with fictional data.

---

# Suggested Third Milestone

## Milestone 3: Core Banking UI

Complete:

- [ ] Phase 8: Accounts
- [ ] Phase 9: Transaction History
- [ ] Phase 10: Money Transfer
- [ ] Phase 11: Bill Payment

### Milestone 3 Result

The main banking UI flows are demonstrated using local demo data and simulated actions.

---

# Suggested Fourth Milestone

## Milestone 4: Additional Services and Personal Pages

Complete:

- [ ] Phase 12: Credit Cards
- [ ] Phase 13: Loans
- [ ] Phase 14: Investing
- [ ] Phase 15: Profile and Settings
- [ ] Phase 16: Security
- [ ] Phase 17: Help and Support

### Milestone 4 Result

The complete set of major banking service and personal pages is available.

---

# Suggested Final Milestone

## Milestone 5: Polish and Testing

Complete:

- [ ] Phase 18: Global Search
- [ ] Phase 19: Logout
- [ ] Phase 20: UI State Handling
- [ ] Phase 21: Accessibility
- [ ] Phase 22: Responsive Testing
- [ ] Phase 23: Final Integration
- [ ] Phase 24: Quality Assurance

### Milestone 5 Result

A connected, responsive, educational frontend prototype that is ready for demonstration and presentation.

---

# Phase Tracking Template

Use this template whenever you begin a phase.

## Current Phase

```text
Phase Number:
Phase Name:
Start Date:
Completion Date:
Status: Not Started / In Progress / Testing / Completed
```

## Tasks

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Issues Found

- Issue:
- Expected Behavior:
- Actual Behavior:
- Fix:

## Testing

- [ ] Desktop tested.
- [ ] Tablet tested.
- [ ] Mobile tested.
- [ ] Console checked.
- [ ] Navigation checked.
- [ ] Accessibility checked.

## Completion Notes

Write what was implemented and what should be done in the next phase.

---

# Final Architecture Principle

Build Bank of Kubera as one connected frontend application.

```text
Consistent Design
       +
Reusable Components
       +
Clear Navigation
       +
Fictional Demo Data
       +
Frontend Validation
       +
Responsive Layout
       +
Accessible UI
       =
Bank of Kubera Prototype
```

The implementation should remain frontend-focused and educational throughout the project.

---

# Professional Creative UI Requirements

These requirements apply throughout every phase:

- Use a polished digital banking visual language rather than a classroom or demo-style interface.
- Use consistent spacing, typography, rounded cards, shadows, icons, and responsive layouts.
- Use meaningful visual components for each banking service.
- Use fictional sample data only and never request or process real credentials, card details, or financial transactions.
- Keep any prototype/testing disclosure discreet and outside the primary marketing experience.
- Every interactive control must have loading, success, empty, error, and disabled states where relevant.
- Every page must support desktop, tablet, and mobile layouts.

---

# Revised Phase-by-Phase Implementation Roadmap

## Phase 1 — Project Setup and Folder Structure

### Objective
Create a clean and scalable frontend project structure.

### Tasks
- Create the root project directory.
- Add `index.html`.
- Add `assets/`, `css/`, `js/`, `components/`, `pages/`, and `data/` folders.
- Create shared stylesheet and JavaScript files.
- Add a consistent naming convention.
- Configure a local development server.
- Add a README with project scope and safety boundaries.

### Suggested Structure

```text
bank-of-kubera/
├── index.html
├── assets/
│   ├── icons/
│   ├── illustrations/
│   └── images/
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── credit-card.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── navigation.js
│   ├── components.js
│   └── validation.js
├── components/
├── pages/
└── data/
    ├── accounts.js
    ├── cards.js
    ├── transactions.js
    └── profile.js
```

### Completion Checklist
- [ ] Project folders created.
- [ ] Local server runs successfully.
- [ ] Initial page loads without console errors.
- [ ] Safety boundaries documented.

---

## Phase 2 — Design Tokens and Global Visual Foundation

### Objective
Create a consistent professional design system.

### Tasks
- Define primary, secondary, accent, success, warning, and error colors.
- Define typography scale.
- Define spacing variables.
- Define border-radius and shadow tokens.
- Define light and optional dark theme variables.
- Create accessible focus styles.
- Establish a responsive breakpoint system.

### Suggested Visual Direction
- Primary: deep navy or charcoal.
- Accent: muted gold, royal purple, or emerald.
- Background: white and soft neutral gray.
- Cards: rounded corners, subtle borders, and layered shadows.
- Typography: clear, professional, and highly readable.

### Completion Checklist
- [ ] Global CSS variables created.
- [ ] Typography scale applied.
- [ ] Buttons and links have hover and focus states.
- [ ] Contrast checked.

---

## Phase 3 — Base HTML and Application Shell

### Objective
Build the shared application structure.

### Tasks
- Create semantic header, navigation, main content, and footer.
- Add desktop navigation.
- Add mobile navigation menu.
- Add notification and profile areas.
- Add page title and breadcrumb patterns.
- Add a responsive content container.

### Required Shell Elements
- Bank of Kubera brand area.
- Home navigation.
- Accounts.
- Transfers.
- Bill Pay.
- Credit Cards.
- Loans.
- Investing.
- Security Center.
- Profile menu.
- Sign-out action.

### Completion Checklist
- [ ] Shell works on desktop.
- [ ] Shell works on mobile.
- [ ] Navigation states are visible.
- [ ] Keyboard navigation works.

---

## Phase 4 — Reusable UI Components

### Objective
Create reusable components to avoid duplicated code.

### Components
- Button.
- Icon button.
- Card container.
- Service card.
- Metric card.
- Modal.
- Drawer.
- Dropdown.
- Toast notification.
- Alert banner.
- Data table.
- Tabs.
- Progress bar.
- Empty state.
- Loading skeleton.
- Error state.
- Credit card preview.

### Completion Checklist
- [ ] Components use consistent styles.
- [ ] Components support disabled and focus states.
- [ ] Components are reusable across pages.
- [ ] Component names and files are organized.

---

## Phase 5 — Homepage and Service Discovery

### Objective
Create a professional homepage that introduces the banking experience without looking like a classroom prototype.

### Homepage Sections
- Hero section.
- Service discovery grid.
- Banking benefits.
- Dashboard preview.
- Security-focused section.
- Call-to-action section.
- Footer.

### Service Visual Requirements

| Service | Required Visual |
|---|---|
| Accounts | Balance summary and mini chart |
| Transfers | Account-to-account flow illustration |
| Bill Pay | Bill and calendar visual |
| Credit Cards | Interactive designed credit card |
| Loans | Finance-related illustration |
| Investing | Portfolio chart |
| Security | Shield and lock visual |

### Homepage Credit Card Preview
Include:
- Fictional Bank of Kubera credit card.
- Masked sample card number.
- Chip and contactless icon.
- Cardholder and expiry date.
- Gradient or abstract pattern.
- Hover lift or subtle tilt effect.
- `Explore Credit Cards` action.

### Completion Checklist
- [ ] Homepage feels like a modern banking platform.
- [ ] Services include meaningful visuals.
- [ ] Credit card preview is visible.
- [ ] Layout is responsive.
- [ ] No real-bank impersonation claims are used.

---

## Phase 6 — Sign-In and Access Experience

### Objective
Build a professional sign-in interface using controlled fictional access data.

### Tasks
- Create sign-in form.
- Add username and password fields.
- Add show/hide password control.
- Add validation messages.
- Add remember-device visual option without persistent sensitive storage.
- Add sign-in loading state.
- Add invalid credentials state.
- Add successful navigation to the dashboard.

### Safety Requirements
- Use fictional test credentials.
- Do not transmit credentials to external services.
- Do not store real passwords.
- Clearly separate frontend authentication simulation from real authentication.

### Completion Checklist
- [ ] Form validation works.
- [ ] Loading state works.
- [ ] Error state works.
- [ ] Successful sign-in routes to dashboard.
- [ ] Password input is not logged in the console.

---

## Phase 7 — Demo Data and Application State

### Objective
Create organized fictional data for all screens.

### Data Categories
- Customer profile.
- Accounts.
- Balances.
- Transactions.
- Credit cards.
- Loans.
- Investments.
- Bills.
- Notifications.
- Security events.

### Credit Card Data Example

```javascript
const creditCard = {
  name: "Kubera Signature Card",
  holder: "NARESH KUMAR",
  maskedNumber: "•••• •••• •••• 4821",
  expiry: "09/30",
  availableCredit: 85000,
  currentBalance: 15240,
  paymentDue: "18 October",
  rewardPoints: 2480,
  status: "active",
  theme: "midnight-navy"
};
```

### Completion Checklist
- [ ] Data is separated from UI code.
- [ ] All values are fictional.
- [ ] Data can be reused by multiple pages.
- [ ] State updates do not require a backend.

---

## Phase 8 — Dashboard

### Objective
Create a personalized banking dashboard.

### Dashboard Components
- Welcome message.
- Total balance card.
- Checking account card.
- Savings account card.
- Credit card summary.
- Recent transactions.
- Quick actions.
- Spending chart.
- Notifications.
- Security status.

### Creative Dashboard Features
- Animated balance count only when appropriate.
- Mini charts.
- Account cards with icons.
- Quick action buttons.
- A featured credit card preview.
- Clear hierarchy between balances and actions.

### Completion Checklist
- [ ] Dashboard loads after sign-in.
- [ ] Data cards are responsive.
- [ ] Quick actions navigate correctly.
- [ ] Empty and loading states exist.

---

## Phase 9 — Accounts and Account Details

### Objective
Allow users to view fictional account information.

### Tasks
- Display account list.
- Show account type and balance.
- Add account detail page.
- Add transaction preview.
- Add account-specific action buttons.
- Add account filters.

### Visual Requirements
- Account cards with clear icons.
- Balance emphasis.
- Small trend charts.
- Clear account status indicators.
- Responsive layout.

### Completion Checklist
- [ ] Account list works.
- [ ] Account details open correctly.
- [ ] Filters work.
- [ ] No real account data is used.

---

## Phase 10 — Transaction History

### Objective
Display an organized transaction experience.

### Tasks
- Build transaction table.
- Add search.
- Add category filter.
- Add date filter.
- Add income and expense indicators.
- Add transaction detail drawer.
- Add empty and no-results states.

### Visual Requirements
- Positive values use accessible success styling.
- Expenses use a distinct but readable visual treatment.
- Transaction icons identify categories.
- Mobile view changes the table into stacked transaction cards.

### Completion Checklist
- [ ] Search works.
- [ ] Filters work.
- [ ] Detail drawer works.
- [ ] Mobile layout is usable.

---

## Phase 11 — Money Transfer

### Objective
Create a multi-step transfer workflow.

### Steps
1. Select source account.
2. Select recipient from fictional saved recipients.
3. Enter amount.
4. Review transfer.
5. Show confirmation result.

### Required States
- Invalid amount.
- Missing account.
- Insufficient fictional balance.
- Review state.
- Processing state.
- Success state.
- Failure state.

### Safety Boundary
The transfer flow must update only frontend state and must never initiate a real financial transaction.

### Completion Checklist
- [ ] Multi-step flow works.
- [ ] Validation works.
- [ ] Review screen is clear.
- [ ] Success and failure states are visible.

---

## Phase 12 — Bill Pay

### Objective
Create a fictional bill payment workflow.

### Tasks
- Display saved billers.
- Add biller cards.
- Select biller.
- Enter payment amount.
- Select payment date.
- Review payment.
- Show confirmation state.

### Creative Visuals
- Bill document cards.
- Calendar icons.
- Due-date badges.
- Payment progress indicator.

### Completion Checklist
- [ ] Biller list works.
- [ ] Payment form validates input.
- [ ] Review and confirmation screens work.
- [ ] No real payment system is connected.

---

## Phase 13 — Credit Cards and Creative Card Experience

### Objective
Build a visually strong credit card management page.

### Main Layout
- Large credit card preview.
- Card balance and available credit.
- Payment due date.
- Reward points.
- Card status.
- Card action controls.
- Spending overview.
- Recent card transactions.

### Credit Card Preview Requirements
- Bank of Kubera branding.
- Fictional cardholder.
- Masked number.
- Chip.
- Contactless icon.
- Expiry date.
- Network label.
- Gradient or abstract card pattern.
- Multiple theme options.

### Card Actions
- View Card Details.
- Manage Card.
- Freeze Card.
- Unfreeze Card.
- Payment History.
- Set Spending Limit.
- Replace Card.

### Frontend Interactions
- Hover lift effect.
- Theme switcher.
- Card detail modal.
- Freeze/unfreeze state.
- Spending limit form.
- Payment history drawer.
- Toast notifications.

### Responsive Requirements
- Desktop: card preview beside metrics.
- Tablet: card preview above metrics.
- Mobile: stacked layout with full-width controls.
- Buttons must remain accessible and easy to tap.

### Completion Checklist
- [ ] Card preview is visually polished.
- [ ] Card theme changes work.
- [ ] Freeze state works.
- [ ] Metrics are displayed clearly.
- [ ] Spending chart works.
- [ ] Fictional card information is used only.

---

## Phase 14 — Loans

### Objective
Create a loan overview and application-style frontend experience.

### Tasks
- Display loan products.
- Show interest and repayment sample information.
- Add loan detail cards.
- Add repayment schedule preview.
- Add eligibility information layout.
- Add frontend-only application form.

### Creative Visuals
- Home loan illustration.
- Vehicle loan illustration.
- Education loan illustration.
- Repayment progress bar.

### Completion Checklist
- [ ] Loan cards are responsive.
- [ ] Sample calculations are clearly labeled.
- [ ] Forms validate correctly.
- [ ] No real loan application is submitted.

---

## Phase 15 — Investing

### Objective
Create an investment dashboard visual.

### Components
- Portfolio value.
- Performance chart.
- Asset allocation.
- Watchlist.
- Investment category cards.
- Risk information panel.

### Creative Visuals
- Line chart.
- Portfolio distribution chart.
- Investment category icons.
- Performance indicators.

### Completion Checklist
- [ ] Charts display fictional data.
- [ ] Portfolio cards work.
- [ ] Responsive charts are implemented.
- [ ] No real trading or investment order is submitted.

---

## Phase 16 — Profile and Settings

### Objective
Create a complete profile and preferences experience.

### Sections
- Personal information.
- Contact details.
- Notification preferences.
- Appearance settings.
- Language preference.
- Security settings.
- Connected device display.

### Requirements
- Use editable frontend forms.
- Validate inputs.
- Show save confirmation locally.
- Provide reset and cancel controls.
- Do not store sensitive real data.

### Completion Checklist
- [ ] Forms work.
- [ ] Validation messages are clear.
- [ ] Save and cancel states work.
- [ ] Settings are responsive.

---

## Phase 17 — Security Center

### Objective
Create a security-focused user experience.

### Components
- Security score visual.
- Recent sign-in activity.
- Device list.
- Password update interface.
- Two-step verification presentation.
- Security alerts.
- Freeze and review actions.

### Creative Visuals
- Shield illustration.
- Lock icons.
- Timeline of security events.
- Status badges.

### Completion Checklist
- [ ] Security status is visible.
- [ ] Alerts are readable.
- [ ] Device cards are responsive.
- [ ] No real security credentials are collected.

---

## Phase 18 — Help and Support

### Objective
Build a professional support experience.

### Tasks
- Searchable FAQ.
- Help categories.
- Contact support form.
- Support request status card.
- Troubleshooting sections.
- Expandable FAQ accordions.

### Completion Checklist
- [ ] FAQ search works.
- [ ] Accordions are accessible.
- [ ] Support form validates.
- [ ] Requests remain frontend-only.

---

## Phase 19 — Global Search

### Objective
Allow users to search across the application.

### Search Categories
- Accounts.
- Transactions.
- Cards.
- Loans.
- Investing.
- Help articles.
- Settings.

### Requirements
- Search input with icon.
- Recent searches.
- Categorized results.
- No-results state.
- Keyboard navigation.
- Mobile-friendly search overlay.

### Completion Checklist
- [ ] Search returns relevant fictional records.
- [ ] Results are categorized.
- [ ] No-results state works.
- [ ] Keyboard support works.

---

## Phase 20 — Navigation, Logout, and Session State

### Objective
Complete the application navigation lifecycle.

### Tasks
- Implement route or view switching.
- Add active navigation indicators.
- Add logout confirmation.
- Clear local session state.
- Return user to sign-in page.
- Prevent access to protected views after logout.

### Completion Checklist
- [ ] Navigation works from every page.
- [ ] Logout works.
- [ ] Session state clears correctly.
- [ ] Protected views are handled.

---

## Phase 21 — UI State and Feedback System

### Objective
Make the application feel responsive and complete.

### Required States
- Loading.
- Success.
- Error.
- Empty.
- Disabled.
- No results.
- Confirmation.
- Processing.

### Feedback Components
- Toast notifications.
- Inline validation.
- Alert banners.
- Skeleton loaders.
- Confirmation modals.
- Progress indicators.

### Completion Checklist
- [ ] All major actions have feedback.
- [ ] Errors are understandable.
- [ ] Loading states do not block unnecessarily.
- [ ] Success messages are visible.

---

## Phase 22 — Accessibility

### Objective
Ensure the application is usable by a broad range of users.

### Tasks
- Use semantic HTML.
- Add accessible labels.
- Support keyboard navigation.
- Provide visible focus states.
- Use proper heading order.
- Ensure adequate color contrast.
- Add ARIA attributes only when needed.
- Respect reduced-motion preferences.

### Completion Checklist
- [ ] Keyboard-only navigation tested.
- [ ] Form labels verified.
- [ ] Focus states visible.
- [ ] Contrast checked.
- [ ] Screen-reader-friendly structure reviewed.

---

## Phase 23 — Responsive Design and Browser Testing

### Objective
Verify that the application works across screen sizes.

### Test Sizes
- Mobile: 320px, 375px, 414px.
- Tablet: 768px, 1024px.
- Desktop: 1280px, 1440px, 1920px.

### Test Areas
- Navigation.
- Dashboard cards.
- Credit card preview.
- Tables.
- Forms.
- Modals.
- Charts.
- Footer.
- Touch controls.

### Completion Checklist
- [ ] No horizontal overflow.
- [ ] Text remains readable.
- [ ] Credit card preview scales correctly.
- [ ] Buttons are touch-friendly.
- [ ] Layout remains consistent.

---

## Phase 24 — Final Integration and Quality Assurance

### Objective
Connect all frontend sections into one consistent user journey.

### End-to-End Journey
1. Open homepage.
2. Explore services.
3. Open sign-in.
4. Sign in with fictional credentials.
5. View dashboard.
6. Open accounts.
7. Review transactions.
8. Open Credit Cards.
9. Interact with the credit card preview.
10. Freeze and unfreeze the fictional card.
11. Explore transfer and bill pay flows.
12. Open security center.
13. Search for a page or transaction.
14. Sign out.

### Final QA Checklist
- [ ] All navigation links work.
- [ ] All buttons have an intended action.
- [ ] No broken images or missing assets.
- [ ] No console errors.
- [ ] No real credentials are collected.
- [ ] No real financial APIs are connected.
- [ ] No real transactions are performed.
- [ ] All pages have responsive layouts.
- [ ] Credit card visual is polished.
- [ ] Loading, success, error, and empty states are implemented.
- [ ] Accessibility checks are completed.
- [ ] README and project documentation are updated.

---

# Suggested Milestones

## Milestone 1 — Foundation
Complete Phases 1–4.

## Milestone 2 — Public Banking Experience
Complete Phases 5–7.

## Milestone 3 — Core Banking Screens
Complete Phases 8–12.

## Milestone 4 — Creative Product Modules
Complete Phases 13–15.

## Milestone 5 — Account Management and Support
Complete Phases 16–20.

## Milestone 6 — Quality and Delivery
Complete Phases 21–24.

---

# Implementation Tracking Template

| Phase | Status | Notes |
|---|---|---|
| 1. Project Setup | Not Started | |
| 2. Design Foundation | Not Started | |
| 3. Application Shell | Not Started | |
| 4. Reusable Components | Not Started | |
| 5. Homepage | Not Started | |
| 6. Sign-In | Not Started | |
| 7. Demo Data | Not Started | |
| 8. Dashboard | Not Started | |
| 9. Accounts | Not Started | |
| 10. Transactions | Not Started | |
| 11. Transfers | Not Started | |
| 12. Bill Pay | Not Started | |
| 13. Credit Cards | Not Started | |
| 14. Loans | Not Started | |
| 15. Investing | Not Started | |
| 16. Profile and Settings | Not Started | |
| 17. Security Center | Not Started | |
| 18. Help and Support | Not Started | |
| 19. Global Search | Not Started | |
| 20. Logout and Session | Not Started | |
| 21. UI States | Not Started | |
| 22. Accessibility | Not Started | |
| 23. Responsive Testing | Not Started | |
| 24. Final QA | Not Started | |

---

# Final Product Direction

Bank of Kubera should feel like a modern, premium digital banking interface with:

- Creative visual service cards.
- A polished interactive credit card design.
- Clear dashboard metrics.
- Consistent navigation.
- Professional typography.
- Responsive layouts.
- Accessible interactions.
- Meaningful loading and feedback states.
- Fictional data and frontend-only behavior.
