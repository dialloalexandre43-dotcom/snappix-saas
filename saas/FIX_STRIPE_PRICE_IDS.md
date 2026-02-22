# 🔧 Fix Stripe Price IDs

## ❌ Error: "No such price: 'price_1T1pKwEsWYYtIPnHdyHdpL2F'"

This error means the Price ID doesn't exist in your Stripe account (TEST mode).

## ✅ Solution: Verify and Create Price IDs in Stripe

### Step 1: Go to Stripe Dashboard (TEST Mode)

1. Open: https://dashboard.stripe.com/test/products
2. Make sure you're in **TEST mode** (toggle in top right should say "Test mode")

### Step 2: Check if Products Exist

You need **2 products**:
- **STARTER** (€9/month)
- **PRO** (€29/month)

### Step 3: Create Products if They Don't Exist

#### Create STARTER Product:
1. Click **"+ Add product"**
2. Name: `STARTER`
3. Description: `Essential plan - 50 images/month`
4. Pricing model: **Recurring**
5. Price: `9.00` EUR
6. Billing period: **Monthly**
7. Click **"Save product"**
8. **Copy the Price ID** (starts with `price_...`)

#### Create PRO Product:
1. Click **"+ Add product"**
2. Name: `PRO`
3. Description: `Power user plan - 300 images/month`
4. Pricing model: **Recurring**
5. Price: `29.00` EUR
6. Billing period: **Monthly**
7. Click **"Save product"**
8. **Copy the Price ID** (starts with `price_...`)

### Step 4: Update .env.local

Replace the Price IDs in your `.env.local` file:

```env
STRIPE_PRICE_ID_STARTER=price_YOUR_NEW_STARTER_PRICE_ID
STRIPE_PRICE_ID_PRO=price_YOUR_NEW_PRO_PRICE_ID
```

### Step 5: Restart the Server

After updating `.env.local`, restart the server:
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

## 🔍 How to Find Price IDs

1. Go to: https://dashboard.stripe.com/test/products
2. Click on a product
3. In the "Pricing" section, you'll see the Price ID
4. It looks like: `price_1T1pJmEsWYYtIPnHFaeo5Ylr`

## ⚠️ Important

- Make sure you're in **TEST mode** (not Live mode)
- Price IDs in TEST mode start with `price_` but are different from Live mode
- The Price IDs in your `.env.local` must match the ones in your Stripe TEST dashboard

