import { useRef, useState } from 'react';
import { Button, TextInput, Textarea, Label } from 'flowbite-react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';

const SERVICE_ID = 'service_djx02lo';
const TEMPLATE_ID = 'template_mrpwiz1';
const PUBLIC_KEY = 'e-3bIOzyYzVRbHUrv';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
      staggerChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Contact = () => {
  const formRef = useRef();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSent(false);

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY).then(
      () => {
        setSent(true);
        setSending(false);
        formRef.current.reset();
      },
      () => {
        setError('Failed to send message. Please try again.');
        setSending(false);
      }
    );
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 px-4 py-16"
    >
      <motion.div
        variants={fadeUp}
        custom={0}
        className="w-full max-w-2xl bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
      >
        {/* Animated accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-tr from-blue-300 via-purple-300 to-pink-300 rounded-full blur-3xl pointer-events-none animate-pulse"
        />
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 mb-6 text-center"
        >
          Contact Us
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-zinc-600 dark:text-zinc-300 mb-8 text-center text-lg"
        >
          Have a question, suggestion, or just want to say hello? Fill out the
          form below and we’ll get back to you soon!
        </motion.p>
        <motion.form
          ref={formRef}
          className="space-y-6"
          onSubmit={handleSubmit}
          variants={containerVariants}
        >
          <motion.div variants={fadeUp} custom={3}>
            <Label
              htmlFor="user_name"
              value="Your Name"
              className="font-semibold"
            />
            <TextInput
              id="user_name"
              name="user_name"
              type="text"
              required
              placeholder="Enter your name"
              className="mt-2"
              shadow
              autoComplete="off"
              as={motion.input}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={4}>
            <Label
              htmlFor="user_email"
              value="Your Email"
              className="font-semibold"
            />
            <TextInput
              id="user_email"
              name="user_email"
              type="email"
              required
              placeholder="Enter your email"
              className="mt-2"
              shadow
              autoComplete="off"
              as={motion.input}
              whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={5}>
            <Label
              htmlFor="message"
              value="Message"
              className="font-semibold"
            />
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Type your message..."
              className="mt-2"
              shadow
              as={motion.textarea}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px #a5b4fc' }}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={6}>
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              className="w-full py-2 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              disabled={sending}
              as={motion.button}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </motion.div>
          <motion.div
            variants={fadeUp}
            custom={7}
            className="min-h-[28px] flex items-center justify-center"
          >
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-center font-medium"
              >
                Thank you! Your message has been sent.
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-center font-medium"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.section>
  );
};

export default Contact;
