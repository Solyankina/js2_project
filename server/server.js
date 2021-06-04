const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use('/', express.static('../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


/**
 * Активируем мидлвары
 */
app.use(express.json()); // Даем знать приложению, что работаем с json'ом
app.use(express.static(__dirname + '/public')); // запросы в корень нашего сайт отдают содержимое public
app.set('views', __dirname + '../public');
app.use("/product/*", express.static('../public/product.html'));

/**
 * API Каталога
 */
app.get('/api/products', (req, res) => {

    fs.readFile('./db/products.json', 'utf-8', (err, data) => {
        if (err) {
            res.send(JSON.stringify({result: 0, text: err}));
        } else {
            res.send(data);
        }
    });
});

app.get('/api/products/:id', (req, res) => {
    fs.readFile('./db/products.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            // Если товара нет, то добавляем его
            const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'));
            const productId = +req.params.id; // + нужен, чтобы строку привести к числу
            const product = products.find(p => p.id === productId);
            if (product) {
                res.send(product);
            } else {
                res.sendStatus(404, JSON.stringify({result: 0, text: `Cannot find product by id = ${productId}`}));
            }
        }
    });

});
/**
 * API Корзины
 */
app.get('/api/cart', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            res.send(data);
        }
    });
});

// Удаление товара из корзины
app.delete('/api/cart/:id', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            const cart = JSON.parse(data);
            // ищем товар по id
            const find = cart.find(item => item.id === +req.params.id);
            if (find) {
                cart.splice(cart.indexOf(find), 1);

                // пишем обратно
                fs.writeFileSync('./db/cart.json', JSON.stringify(cart))
            }
            res.send(cart);
        }
    });
});

// Изменяем количество товара
app.put('/api/cart/:id', (req, res) => {
    fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            const productId = +req.params.id; // + нужен, чтобы строку привести к числу
            // парсим текущую корзину
            const cart = JSON.parse(data);
            // ищем товар по id
            const find = cart.find(item => item.id === productId);

            if (find) {
                // Если товар уже есть в корзине изменяем его количество
                find.quantity += req.body.quantity;
            } else {
                // Если товара нет, то добавляем его
                const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'));
                const product = products.find(p => p.id === productId);
                const cartItem = Object.assign({quantity: 1}, product)
                cart.push(cartItem);
            }

            // пишем обратно
            fs.writeFile('./db/cart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send(cart);
                }
            })
        }
    });
});


/**
 * Запуск сервера
 * @type {string|number}
 */
// const port = process.env.PORT || 3000;
const port = 80; // чтобы не смущало process.env.PORT (если не стартует на 3000, то меняем на другой 8080 или 8888)
app.listen(port, () => {
    console.log(`Listening ${port} port`);
});
