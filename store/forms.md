# Store forms: answers to fill in

Draft answers, for approval before anything is sent. They follow from what the app does:
no server, no sign-up, no analytics, no ads, no network calls, values stored only on the device.

## Apple App Store Connect

### App Privacy

- Data collection: **Data Not Collected**.
- Tracking: **No**.

### Age rating

Answer **None** or **No** to every item: violence, sexual content, profanity, drugs, alcohol and
tobacco, horror, medical information, gambling and simulated gambling, contests, unrestricted web
access, user-generated content, messaging and chat, in-app purchases, location sharing.
Expected result: the lowest rating (4+).

### Category

- Primary: **Entertainment**.
- Do not pick Finance. Apple's rules for finance apps (guideline 5.1.1(ix)) expect a regulated
  institution behind the app.

### Export compliance

- `ITSAppUsesNonExemptEncryption` is already `false` in `app.json`: the app has no encryption of
  its own.

### Notes for the reviewer

> RichMode is an entertainment app. It shows a made-up account home screen with a balance the
> user types in. Nothing is real: no account, no money, no network calls, no sign-up. Every
> balance carries a "Saldo fictício" / "Fictional balance" label that cannot be turned off. All
> brands in the themes are invented. Shortcuts such as Pix, Transfer and Pay only open a notice
> that says it is a simulation. There are no receipts, statements, QR codes or payment keys.
> No login is needed to review the app.

## Google Play Console

### Data safety

- Does the app collect or share any of the required user data types? **No**.
- Result shown on the listing: "No data collected" and "No data shared".

### Financial features declaration

- Select **"My app doesn't provide any financial features"**.

### Content rating (IARC)

- Category: **Entertainment** (not a game, not a utility).
- Answer **No** to violence, sexuality, language, controlled substances, gambling, user
  interaction or content sharing, location sharing, digital purchases.
- Expected result: Livre (ClassInd, Brazil), Everyone (ESRB), PEGI 3.

### Target audience

- Recommended: **13 and over**. Picking an under-13 group brings in the Families policy and
  its extra review, which the app does not need.

### Ads

- Contains ads: **No**.

### App access

- All features work without login or special access.

### Category

- **Entertainment**.
