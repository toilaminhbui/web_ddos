const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');


const app = express();

app.set('trust proxy', 1);

// // LÀM DELAY KHI VƯỢT QUÁ 30 REQUEST/PHÚT
// const speedLimiter = slowDown({
//     windowMs: 1 * 60 * 1000,
//     delayAfter: 30,
//     delayMs: (hits) => hits * 100,
// });

// // GIỚI HẠN KHI ĐẠT 60 REQUEST/PHÚT
// const limiter = rateLimit({
//     windowMs: 1 * 60 * 1000,
//     max: 60, 
//     message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 1 phút',
//     standardHeaders: true,
//     legacyHeaders: false,
// });

//app.use(limiter);

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// // Giới hạn kích thước dữ liệu JSON nhận vào từ client. 
// app.use(express.json({ limit: '10kb' }));

// // Giới hạn kích thước dữ liệu form-urlencoded nhận vào từ client.
// app.use(express.urlencoded({ limit: '5kb' })); 

// // KIỂM TRA BOT DETECTION
// app.use((req, res, next) => {
//     const userAgent = req.get('User-Agent');
//     const knownBadBots = ['bot', 'spider', 'crawler', 'scan', 'script', 'http', 'curl', 'wget', 'python'];
    
//     if (knownBadBots.some(bot => userAgent.toLowerCase().includes(bot))) {
//         return res.status(403).send('Truy cập bị từ chối');
//     }
//     next();
// });

// // CHỈ CHO PHÉP CÁC PHƯƠNG THỨC GET, POST, OPTIONS
// app.use((req, res, next) => {
//     const allowedMethods = ['GET', 'POST', 'OPTIONS'];

//     if (!allowedMethods.includes(req.method)) {
//         console.log(`Blocked ${req.method} request to ${req.path}`);
//         return res.status(405).send('Method not allowed');
//     }
//     next();
// });

app.get('/',(req, res) => {
    res.render('home');
});

// app.get('/',speedLimiter,limiter,(req, res) => {
//     res.render('home');
// });

// app.get('/shop',speedLimiter,limiter, (req, res) => {
//     console.log("hello");
    
//     res.render('shop');
// });

// app.get('/shop-detail',speedLimiter,limiter, (req, res) => {
//     res.render('shop-detail');
// });

// app.get('/cart',speedLimiter,limiter, (req, res) => {
//     res.render('cart');
// });

// app.get('/testimonial',speedLimiter,limiter, (req, res) => {
//     res.render('testimonial');
// });

// app.get('/contact',speedLimiter,limiter, (req, res) => {
//     res.render('contact');
// });


app.use((req, res, next) => {
    res.status(404).render('404');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên http://localhost:${PORT}`);
});