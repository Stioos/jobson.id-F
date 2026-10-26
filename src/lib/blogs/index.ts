import { blogPostsPart1 } from './data-part1';
import { blogPostsPart2a } from './data-part2a';
import { blogPostsPart2b } from './data-part2b';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'AI' | 'Technology' | 'Career' | 'Marketing';
  author: string;
  readTime: string;
  createdAt: string;
  tags: string[];
  featured?: boolean;
}

export const ALL_BLOG_POSTS: BlogPost[] = [
  ...blogPostsPart1,
  ...blogPostsPart2a,
  ...blogPostsPart2b,
];

export const FEATURED_BLOGS = ALL_BLOG_POSTS.filter(p => p.featured);

export const BLOG_CATEGORIES = ['All', 'Technology', 'Career', 'AI', 'Marketing'] as const;

const BLOG_IMAGES: Record<string, string> = {
  'future-of-ai-india': '/blogs/future-of-ai-india.png',
  'fullstack-development-roadmap': '/blogs/fullstack-development-roadmap.png',
  'crack-faang-interviews': '/blogs/crack-faang-interviews.png',
  'digital-marketing-ai-playbook': '/blogs/digital-marketing-ai-playbook.png',
  'pay-after-placement-revolutionizing-education': '/blogs/pay-after-placement-revolutionizing-education.png',
  'scalable-apis-nodejs-typescript': '/blogs/scalable-apis-nodejs-typescript.png',
  'rise-of-generative-ai-development': '/blogs/rise-of-generative-ai-development.png',
  'mastering-react-19-new-features': '/blogs/mastering-react-19-new-features.png',
  'content-marketing-10x-organic-traffic': '/blogs/content-marketing-10x-organic-traffic.png',
  'cloud-computing-career-guide': '/blogs/cloud-computing-career-guide.png',
  'data-science-vs-machine-learning-career': '/blogs/data-science-vs-machine-learning-career.png',
  'top-20-javascript-frameworks': '/blogs/top-20-javascript-frameworks.png',
  'six-figure-tech-career-no-cs-degree': '/blogs/six-figure-tech-career-no-cs-degree.png',
  'seo-age-of-ai': '/blogs/seo-age-of-ai.png',
  'cybersecurity-careers-india': '/blogs/cybersecurity-careers-india.png',
  'devops-engineering-beginner-expert': '/blogs/devops-engineering-beginner-expert.png',
  'social-media-marketing-trends': '/blogs/social-media-marketing-trends.png',
  'python-ai-machine-learning-guide': '/blogs/python-ai-machine-learning-guide.png',
  'remote-work-tech-career-guide': '/blogs/remote-work-tech-career-guide.png',
  'complete-guide-product-management-tech': '/blogs/complete-guide-product-management-tech.png',
};

export function getBlogImage(slug: string): string | undefined {
  return BLOG_IMAGES[slug];
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return ALL_BLOG_POSTS.find(p => p.slug === slug);
}

export function getRelatedBlogs(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = getBlogBySlug(currentSlug);
  if (!current) return ALL_BLOG_POSTS.slice(0, limit);
  return ALL_BLOG_POSTS
    .filter(p => p.slug !== currentSlug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? 2 : a.tags.some(t => current.tags.includes(t)) ? 1 : 0;
      const bScore = b.category === current.category ? 2 : b.tags.some(t => current.tags.includes(t)) ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}
