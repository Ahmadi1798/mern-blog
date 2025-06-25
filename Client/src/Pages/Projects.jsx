import { motion, AnimatePresence } from 'framer-motion';
import projects from '../../utils/projects';

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

const Projects = () => {
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
        className="w-full max-w-5xl mx-auto"
      >
        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 mb-10 text-center"
        >
          My Recent Projects
        </motion.h1>
        <motion.div
          variants={containerVariants}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                custom={idx + 2}
                exit={{ opacity: 0, y: 40, transition: { duration: 0.3 } }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10)',
                }}
                className="group bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
                <div className="flex-1 flex flex-col p-6">
                  <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors duration-300">
                    {project.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4 flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-auto px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-105 hover:shadow-lg transition-all duration-200 text-center"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Project
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Projects;
