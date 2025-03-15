const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User } = require('../models');

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.APP_PASSWORD
        },
    }
);

// Envoi d'e-mails aux invités
const sendEmail = async (req, res) => {
    const { nameFrom, message, email } = req.body;

    // Vérifications des entrées
    if (!nameFrom || !message || !email) {
        return res.status(400).json({ msg: 'Tous les champs sont obligatoires (nameFrom, message, email).' });
    }

    // Vérifier si l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: 'Adresse e-mail invalide.' });
    }

    // Vérifier si le message n'est pas trop court
    if (message.length < 10) {
        return res.status(400).json({ msg: 'Le message est trop court (minimum 10 caractères).' });
    }

    const mailOptions = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: `Message de ${nameFrom}`,
        html: `<p>${message}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ msg: 'E-mail envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        return res.status(500).json({ msg: `Erreur serveur : impossible d'envoyer l'e-mail. ${error.message}` });
    }
};

// Réinitialisation de mot de passe
const resetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'L’email est requis.' });
      }
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Aucun compte associé à cet e-mail.' });
      }
  
      const token = crypto.randomBytes(32).toString('hex');
  
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 heure
      await user.save();
  
      await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Réinitialisation de mot de passe',
        html: `
          <h3>Demande de réinitialisation de mot de passe</h3>
          <p>Cliquez sur ce <a href="http://localhost:3000/email/reset/${token}">lien</a> pour réinitialiser votre mot de passe.</p>
          <p>Ce lien est valable pendant 1 heure.</p>
        `,
      });
  
      return res.status(200).json({
        message: 'Email de réinitialisation envoyé avec succès ! Veuillez consulter votre boîte de réception pour continuer.',
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error.message);
      return res.status(500).json({ message: 'Erreur serveur : Impossible de traiter la demande.', error: error.message });
    }
  };

exports.sendEmail = sendEmail;
exports.resetPassword = resetPassword;
