const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');


const app = express();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 12, 
    message: '<h1 style="color: red;text-align: center">Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 1 phút</h1>',
    standardHeaders: true,
    legacyHeaders: false,
});

const speedLimiter = slowDown({
    windowMs: 1 * 60 * 1000,
    delayAfter: 10,
    delayMs: (hits) => hits * 500,
});

//app.use(limiter);

// Cấu hình Handlebars
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware để phục vụ file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '10kb' })); // JSON body
app.use(express.urlencoded({ limit: '5kb' })); // Form data

// HTTP request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});


// 1
// Middleware kiểm tra user-agent
app.use((req, res, next) => {
    const userAgent = req.get('User-Agent');
    const knownBadBots = ['bot', 'spider', 'crawler', 'scan', 'script', 'http', 'curl', 'wget', 'python'];
    
    if (knownBadBots.some(bot => userAgent.toLowerCase().includes(bot))) {
        return res.status(403).send('Truy cập bị từ chối');
    }
    next();
});

// 2
app.use((req, res, next) => {
    const allowedMethods = ['GET', 'POST', 'OPTIONS']; // Chỉ cho phép các methods cần thiết
    
    if (!allowedMethods.includes(req.method)) {
      console.log(`Blocked ${req.method} request to ${req.path}`);
      return res.status(405).send('Method not allowed');
    }
    next();
  });

  app.use((req, res, next) => {
    const country = req.headers['cf-ipcountry'] || 'VN'; // Cloudflare
    if (['CN', 'RU'].includes(country)) {
      return res.status(403).send('Blocked region');
    }
    console.log(country);
    
    next();
  });

// Routes
app.get('/',speedLimiter,limiter,(req, res) => {
    res.render('home');
});

app.get('/shop',speedLimiter,limiter, (req, res) => {
    console.log("hello");
    
    res.render('shop');
});

app.get('/shop-detail',limiter, (req, res) => {
    res.render('shop-detail');
});

app.get('/cart',limiter, (req, res) => {
    res.render('cart');
});

app.get('/testimonial',limiter, (req, res) => {
    res.render('testimonial');
});

app.get('/contact',limiter, (req, res) => {
    res.render('contact');
});


app.use((req, res, next) => {
    res.status(404).render('404');
});
// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên http://localhost:${PORT}`);
});