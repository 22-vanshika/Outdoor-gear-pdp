# Trailhead — Alpine Ascent Pack

Welcome to the Trailhead project! This is a clean, modern, and fast Product Detail Page (PDP) for a premium outdoor gear store. 

## How to Run the Project

You will need Node.js (version 20 or higher) installed on your computer.

1. Open your terminal or command prompt.
2. Install the necessary files by running:
   `npm install`
3. Start the project by running:
   `npm run dev`
4. Open your web browser and go to `http://localhost:5173` to see the store!

## What We Built

### 📸 Image Gallery
- A large main image that you can zoom into by hovering your mouse (on desktop computers).
- Smaller images below it. Clicking them changes the main image.
- On mobile phones, you can easily swipe left and right to see all images, with helpful dots and arrows showing your position.

### 🛒 Product Info & Shopping
- Clear product name, brand, and pricing (including sale discounts).
- Clickable color choices. The available sizes change automatically based on the color you pick.
- Smart size buttons that tell you when stock is low or sold out.
- A quantity picker that won't let you add more items than we actually have in stock.
- An "Add to Cart" button that updates based on availability.

### 🛍️ The Shopping Cart
- A sleek cart menu that slides in from the side (or bottom on mobile).
- You can change item quantities or remove items directly from the cart.
- It calculates your total and checks if you qualify for free shipping.
- **Smart Memory:** If you refresh the page, your cart items are saved and won't disappear!

### 🔗 Smart Web Links
- When you select a color and size, the web link (URL) updates automatically. You can copy this link and send it to a friend, and they will see the exact same color and size!

### 📱 Works on All Devices
- The page looks beautiful on wide desktop screens and adapts perfectly for mobile phones with easy-to-tap buttons.

## Design Decisions and Trade-offs
To read about why we built things the way we did, please read the [DECISIONS.md](./DECISIONS.md) file. It explains our choices in very simple terms.

## What's Next (Trade-offs)
- The "Checkout" button in the cart doesn't take your money yet (it's just a test project).
- The Newsletter form at the bottom clears when you hit submit, but doesn't send a real email.
- The product colors and sizes are stored locally in the app, rather than coming from a live server.

Enjoy exploring the Trailhead store!
