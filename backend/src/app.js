import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({extended:true, limit:'16kb'}))
app.use(express.static("public"));
app.use(cookieParser());

// All Routes
import userRoutes from "./routes/user.routes.js"
import restaurantRoutes from './routes/restaurant.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import orderRoutes from './routes/order.routes.js'
import foodRoutes from './routes/food.routes.js'
import cartRoutes from './routes/cart.routes.js'
import adminRoutes from './routes/admin.routes.js'
import addressRoutes from './routes/address.routes.js'

app.use('/api/v1/user', userRoutes)
app.use("/api/v1/restaurant", restaurantRoutes)
app.use('/api/v1/payment', paymentRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/food', foodRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/address', addressRoutes)




export {app}