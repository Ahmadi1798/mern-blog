import { motion } from 'framer-motion';

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

const About = () => {
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
          className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-tr from-blue-300 via-purple-300 to-pink-300 rounded-full blur-3xl pointer-events-none animate-pulse"
        />
        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 mb-6 text-center"
        >
          About MERN Blog
        </motion.h1>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-zinc-700 dark:text-zinc-200 text-lg mb-6 text-center"
        >
          MERN Blog is a modern, minimalistic platform built for creators,
          developers, and thinkers to share ideas, learn, and grow together.
        </motion.p>
        <motion.div
          variants={containerVariants}
          className="flex flex-col gap-6"
        >
          {[
            {
              icon: '📝',
              title: 'Effortless Writing',
              desc: 'Enjoy a distraction-free editor and publish your thoughts with ease. Focus on your ideas, not the tools.',
            },
            {
              icon: '🚀',
              title: 'Discover & Connect',
              desc: 'Explore trending topics, connect with like-minded people, and get inspired by the community.',
            },
            {
              icon: '🌱',
              title: 'Grow Together',
              desc: 'Whether you’re a beginner or a pro, MERN Blog is a place to learn, share, and grow your knowledge.',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              custom={i + 3}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10)',
              }}
              className="flex items-start gap-4 group transition-transform duration-200"
            >
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h2 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  {feature.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div variants={fadeUp} custom={6} className="mt-10 text-center">
          <motion.span
            whileHover={{
              scale: 1.08,
              boxShadow: '0 4px 24px 0 rgba(139,92,246,0.13)',
            }}
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-700 dark:text-blue-300 font-semibold shadow hover:scale-105 transition-transform duration-200"
          >
            Built with ❤️ using the MERN Stack
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default About;
