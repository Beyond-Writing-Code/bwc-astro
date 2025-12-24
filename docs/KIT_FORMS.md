# Kit.com Forms

## 1. About Kit Forms

This site relies on several forms created and maintained on Kit.com, formerly ConvertKit.com.

Forms are embedded using the `KitForm` React component (`src/components/KitForm.tsx`), which dynamically loads Kit's JavaScript SDK. This provides better UX than iframe embeds (inline success messages, no popup windows).

### CSP Note

The Kit JS embed requires `'unsafe-inline'` in the `style-src` CSP directive because Kit injects inline styles for form rendering. This is an acceptable security tradeoff—style injection cannot execute code, unlike script injection.

## 2. Forms

### 2.1 Small Signup Form (Footer)

Form ID: `86bb906577`

The Small Signup Form includes email, first name, and a subscribe button with additional context text.

### 2.2 Mini Form (Home, Posts)

Form ID: `c29f7b6897`

The Mini Form is a compact inline form with email address, first name (optional), and a Subscribe button.

### 2.3 Card Form

Form ID: `e8bea8d2f2`

The Card Form includes email, first name, and a dropdown field for additional information.

## 3. Usage

All forms use the `KitForm` component:

```astro
---
import KitForm from '../components/KitForm.tsx';
---

<KitForm formId="c29f7b6897" className="my-form-class" client:load />
```

### 3.1 Footer

- Component: `src/components/layout/Footer.jsx`
- Form: Small Signup Form (`86bb906577`)
- Displayed on all pages except home

### 3.2 Home Page

- Component: `src/pages/Home.jsx`
- Form: Mini Form (`c29f7b6897`)

### 3.3 Posts Page

- Component: `src/pages/Posts.jsx`
- Form: Mini Form (`c29f7b6897`)

### 3.4 Card Page

- Component: `src/pages/Card.jsx`
- Form: Card Form (`e8bea8d2f2`)
