const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(fileUpload());
app.use(express.static('public')); // Для стилей, если будут
app.use('/file', express.static('uploads')); // Папка с файлами

const UPLOADS_DIR = './uploads';

// Создаём папку uploads, если её нет
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Загрузка файла
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.json({ success: false, error: 'Файл не выбран' });
  }

  const file = req.files.file;
  const filename = Date.now() + path.extname(file.name); // Уникальное имя

  file.mv(`${UPLOADS_DIR}/${filename}`, (err) => {
    if (err) {
      return res.json({ success: false, error: 'Ошибка загрузки' });
    }
    res.json({ success: true, filename });
  });
});

// Удаление файла
app.delete('/delete/:filename', (req, res) => {
  const filepath = `${UPLOADS_DIR}/${req.params.filename}`;
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    res.json({ success: true });
  } else {
    res.json({ success: false, error: 'Файл не найден' });
  }
});

// Порт
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});