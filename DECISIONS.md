# DECISIONS.md

This document explains the choices we made while building this project. It is written in simple language for everyone to understand.

---

## 1. Tabs vs Accordion (Product Details)
**Decision: Tabs**

We had to choose how to show product details (Description, Specs, Reviews) at the bottom. We could use a list that expands when clicked (Accordion) or a row of buttons to switch views (Tabs). 
I chose Tabs because people usually scan product pages quickly. With tabs, you can see all available sections at a glance without having to scroll down a long page. To make it work well on mobile phones, the tabs can be swiped left and right.

## 2. Image Zoom
**Decision: Simple Hover Zoom (CSS Transform)**

When you move your mouse over the main image on a computer, it zooms in. I used a simple styling trick instead of complex code. This makes the page load faster and keeps the code clean, while still giving users a great way to see product details. We turned this off for mobile phones since you can't "hover" with a finger.

## 3. How We Store the Shopping Cart
**Decision: React Context API**

We needed a way to remember what is in the shopping cart across the whole page. I chose React's built-in "Context API". Some projects use extra tools (like Redux or Zustand) for this, but our app only has one page and one cart. Using the built-in tool keeps our project small, fast, and easy to maintain. 

## 4. Handling Product Colors and Sizes
**Decision: Combine Real API Data with Local Data**

The assignment asked us to get product data from a free service (Fake Store API). However, that service does not provide colors, sizes, or stock numbers. 
To solve this, I fetched the basic product info from the API, and then mixed it with a local file I created (`variantConfig.ts`) that contains the colors, sizes, and stock. This gives us a realistic shopping experience while still proving that I can connect to a real internet API.

## 5. Mobile Image Dots
**Decision: Checking Scroll Position**

On mobile phones, you can swipe the images left and right. I added dots below the images to show which image you are looking at. The app constantly checks the scroll position to highlight the correct dot. It is a very reliable and smooth way to keep the images and dots matching.

## 6. Cart Memory (Saving Data)
**Decision: Read Memory Right Away**

When you refresh the page, we don't want the cart to look empty for a split second before loading your items. So, the app reads the saved cart data immediately as the page loads. This prevents a flickering screen and makes the app feel very fast.

## 7. Web Links and URL Sharing
**Decision: Update the URL quietly**

When you select a color and size, the web link (URL) updates automatically (like `?colour=slate-blue&size=20l`). I made sure that clicking different colors doesn't fill up your browser's "Back" button history. Also, if someone sends you a link with a color that is sold out, the app is smart enough to pick an available one instead of breaking.

## 8. Limiting How Many You Can Buy
**Decision: Check the Cart Live**

We need to stop people from adding more items than we have in stock. Instead of saving a separate "sold out" flag, the app constantly checks how many items are currently in your cart and compares it to our total stock. This ensures you can never accidentally buy more than what is available.

## 9. Cart Drawer vs Cart Page
**Decision: A Slide-in Drawer**

Instead of taking you to a whole new page to see your cart, a drawer slides in from the side (or the bottom on mobile). This keeps you on the product page so you don't lose your place and can easily go right back to shopping.

## 10. Stock for Each Specific Color
**Decision: Separate Stock Counts**

Originally, the stock number was shared across all colors. But in real life, we might have 10 blue backpacks and 0 black ones. I updated the code so each color has its own independent stock numbers. Now, when you switch colors, the size buttons update to show exactly what is available for that specific color.

## 11. Storing Max Quantity
**Decision: Save it directly on the cart item**

When an item is added to the cart, the cart remembers the maximum amount you are allowed to buy right on the item itself. This keeps the cart code simple because it doesn't have to constantly ask the main product database for stock checks.

## 12. Loading the Bottom of the Page
**Decision: Lazy Loading**

The details section (tabs and reviews) at the bottom is hidden when you first open the page. To make the website load faster, the app doesn't download that code until you scroll down. It saves data and makes the top of the page appear instantly.

## 13. Storing Description and Reviews
**Decision: A Local Data File**

Because the free API doesn't give us a product description or reviews, I created a local file (`productDetails.ts`) to hold all of this text. This keeps the main code clean and makes it very easy to plug in a real database later if we want to.

## 14. Precision Engineering Section Layout
**Decision: Different layouts for Desktop and Mobile**

For the "Precision Engineering" section, desktop screens get a beautiful mixed grid with large images and text cards. But on mobile, trying to squeeze in images makes the screen too crowded. So on mobile, it just shows a clean stack of text cards without the images. It looks perfect on both devices.

## 15. Footer Design
**Decision: One Big Component**

The footer at the bottom of the page has 4 columns on desktop and 2 columns on mobile. Instead of breaking it into a bunch of tiny, complicated code files, I kept it all in one file. It uses simple styling rules to change how it looks based on your screen size.

---

## Future Improvements (What I Would Do With More Time)

1. **Real Data Server:** Instead of mixing local data with the API, I would build a real server that sends all the product variants, colors, and stock levels together.
2. **Sync Link Before Cart:** I built the cart memory first, then the URL link memory. I should have done it the other way around so they work together perfectly when you refresh the page.
3. **Remember Quantity in Link:** Right now, the web link remembers your color and size choice. I would update it to also remember the quantity you selected.
4. **Faster Images:** The images take a few seconds to load on slow internet connections. I would ask the image server to send much smaller, faster versions of the images.
5. **Handle Errors Better:** If the internet breaks, a small error text appears. It would be better to show a nice, friendly "Oops, something went wrong" page instead.
6. **Lock the Screen for the Cart:** When the cart drawer is open, keyboard users can accidentally select things behind the drawer. I would lock it so they can only interact with the cart until they close it.
7. **Make Top Links Work:** The links at the very top (Shop All, Apparel, etc.) don't go anywhere right now. I would add real pages for them.
8. **Real Newsletter Form:** The newsletter sign-up at the bottom clears when you type your email, but it doesn't actually send it anywhere. I would connect it to a real email service and show a "Thank You!" message.
