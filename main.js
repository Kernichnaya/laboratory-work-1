const http = require('http');
const fs = require('fs');
const handlebars = require('handlebars');

const template = fs.readFileSync('./templates/index.hbs').toString();
const hbTemplate = handlebars.compile(template);
const fruits = [
    { value: '', title: '' },
    { value: 'Яблоко', title: 'Яблоко' },
    { value: 'Апелсин', title: 'Апелсин' },
    { value: 'Банан', title: 'Банан' },
    { value: 'Гранат', title: 'Гранат' },
    { value: 'Персик', title: 'Персик' },
];
const templateData = {
    favorite: '',
    fruits: fruits
};

handlebars.registerHelper('selectedIf', function (cond) {
    if (cond) {
        return 'selected';
    } else {
        return '';
    }
});

const server = http.createServer(function (req, res) {
    console.log(`Method: ${req.method}, Path: ${req.url}, Time: ${new Date().toLocaleTimeString()}`);
    if (req.url === '/') {
        switch (req.method) {
            case 'GET': {
                const page = hbTemplate(templateData);
                res.statusCode = 200;
                res.write(page, function (err) {
                    if (err) {
                        console.log('Data error!');
                    }
                });
                res.end();
                break;
            }
            case 'POST': {
                let data = '';
                req.addListener('data', function (chunk) {
                    data += chunk;
                });
                req.addListener('end', function () {
                    let favorite = '';
                    if (data) {
                        favorite = data.split('=')[1].slice(0, -2);
                    }
                    const page = hbTemplate({
                        favorite: favorite,
                        fruits: fruits.map(function (f) {
                            if (f.value === favorite) {
                                return {
                                    title: f.title,
                                    value: f.value,
                                    selected: 'selected'
                                };
                            } else {
                                return f;
                            }
                        })
                    });
                    res.statusCode = 200;
                    res.write(page, function (err) {
                        if (err) {
                            console.log('Data error!');
                        }
                    });
                    res.end();
                });
                break;
            }
        }
    } else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(process.env.PORT || 3000, function () {
    console.log('Server is start! Listen port: 3000');
});
