import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

import FloatingBackButton from '@/components/FloatingBackButton';
import { colors, images } from '@/constants';

const EMAIL = 'singhayush9410@gmail.com';
const PHONE = '+91 93367 15700';
const LINKEDIN = 'https://linkedin.com/in/ayushsinghsde';
const GITHUB = 'https://github.com/Ayu360';

const SKILLS: { title: string; items: string[] }[] = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'C++', 'Java'] },
  {
    title: 'Frontend',
    items: [
      'React',
      'Next.js',
      'React Native',
      'Expo',
      'Tailwind CSS',
      'Zustand',
      'Redux Toolkit',
      'TanStack Query',
    ],
  },
  {
    title: 'Backend & Cloud',
    items: [
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Elasticsearch',
      'Redis',
      'AWS',
      'Vercel',
      'Firebase',
    ],
  },
];

const EXPERIENCE = [
  {
    company: 'Close App (shuru.co.in)',
    role: 'Product Engineer · Full Stack',
    period: 'Aug 2024 — Present',
    location: 'Indore, M.P.',
    bullets: [
      'Integrated Razorpay subscriptions in a Next.js app with server-side caching, supporting ₹75K+ daily revenue.',
      'Migrated EC2 from 4GB to 8GB and set up Auto Scaling + Load Balancers, cutting downtime from 8h to 5 min.',
      'Architected a crawler indexing 30+ services into Elasticsearch and MongoDB to power profile and monetization features.',
      'Building Fixline, a universal React Native + Expo app with Google/Apple Sign-In, deep linking, and cross-platform screens.',
    ],
  },
  {
    company: 'Ninjacart',
    role: 'Software Engineer Intern',
    period: 'May 2024 — Jul 2024',
    location: 'Bangalore, Karnataka',
    bullets: [
      'Migrated a webview-based ONDC seller app to native, dropping boot time from 3 min to under 5 sec on sub-1kbps networks.',
      'Integrated Firebase push notifications, deep linking, and automated text moderation.',
    ],
  },
];

const PROJECTS = [
  {
    name: 'Work Management Platform',
    stack: 'Next.js 16 · React 19 · Supabase · PostgreSQL',
    body: 'A Jira-inspired platform actively used by the frontend team at Close App. Multi-tenant PostgreSQL with Row Level Security, PKCE password reset, role management, and optimistic Kanban updates.',
  },
  {
    name: 'MovieMania',
    stack: 'React Native · Expo · Node.js · MongoDB',
    body: 'This app. Cross-platform movie discovery with file-based routing, Reanimated animations, TanStack Query infinite scrolling, Google Sign-In, and a Node/Express backend on Render.',
  },
];

const openUrl = (url: string) => {
  WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url));
};

const Developer = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FloatingBackButton topInset={insets.top} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.avatarRing}>
            <Image source={images.ayush} style={styles.avatar} />
          </View>
          <Text style={styles.name}>Ayush Singh</Text>
          <Text style={styles.role}>Product Engineer · Full Stack</Text>
          <Text style={styles.location}>Indore, India</Text>
        </View>

        <View style={styles.chipRow}>
          <LinkChip label="Email" onPress={() => Linking.openURL(`mailto:${EMAIL}`)} />
          <LinkChip label="LinkedIn" onPress={() => openUrl(LINKEDIN)} />
          <LinkChip label="GitHub" onPress={() => openUrl(GITHUB)} />
          <LinkChip label="Call" onPress={() => Linking.openURL(`tel:${PHONE.replace(/\s/g, '')}`)} />
        </View>

        <Section title="About">
          <Text style={styles.body}>
            I&apos;m a Product Engineer who builds and ships end-to-end, with a strong focus on
            ownership, scalable architecture, and the little details that make a product feel
            good to use. I like taking ambiguous problems from idea to production and turning
            them into simple, reliable software.
          </Text>
          <Text style={styles.body}>
            MovieMania is one of my side projects — built with React Native, Expo, and a
            Node.js backend on Render.
          </Text>
        </Section>

        <Section title="Experience">
          {EXPERIENCE.map((job) => (
            <View key={job.company} style={styles.card}>
              <View style={styles.jobHeader}>
                <Text style={styles.company}>{job.company}</Text>
                <Text style={styles.period}>{job.period}</Text>
              </View>
              <Text style={styles.roleLine}>{job.role}</Text>
              <Text style={styles.locationDim}>{job.location}</Text>
              <View style={styles.bullets}>
                {job.bullets.map((b) => (
                  <View key={b} style={styles.bulletRow}>
                    <View style={styles.dot} />
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Section>

        <Section title="Skills">
          {SKILLS.map((group) => (
            <View key={group.title} style={styles.skillGroup}>
              <Text style={styles.skillTitle}>{group.title}</Text>
              <View style={styles.skillChips}>
                {group.items.map((item) => (
                  <View key={item} style={styles.skillChip}>
                    <Text style={styles.skillText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Section>

        <Section title="Projects">
          {PROJECTS.map((p) => (
            <View key={p.name} style={styles.card}>
              <Text style={styles.projectName}>{p.name}</Text>
              <Text style={styles.stack}>{p.stack}</Text>
              <Text style={styles.body}>{p.body}</Text>
            </View>
          ))}
        </Section>

        <Section title="Education">
          <View style={styles.card}>
            <Text style={styles.company}>Lovely Professional University</Text>
            <Text style={styles.roleLine}>B.Sc. Computer Science</Text>
            <Text style={styles.locationDim}>Jalandhar, Punjab · 2020 — 2024</Text>
          </View>
        </Section>

        <Text style={styles.footer}>Thanks for checking out MovieMania.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

type SectionProps = { title: string; children: React.ReactNode };

const Section = ({ title, children }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

type LinkChipProps = { label: string; onPress: () => void };

const LinkChip = ({ label, onPress }: LinkChipProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.linkChip, pressed && { opacity: 0.6 }]}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Text style={styles.linkChipText}>{label}</Text>
  </Pressable>
);

const AVATAR_SIZE = 132;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarRing: {
    padding: 3,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 2,
    borderColor: colors.accent.orange,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  name: {
    color: colors.text.DEFAULT,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 16,
    letterSpacing: -0.3,
  },
  role: {
    color: colors.accent.amber,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  location: {
    color: colors.text.dim,
    fontSize: 13,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  linkChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  linkChipText: {
    color: colors.text.DEFAULT,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.text.DEFAULT,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.1,
  },
  body: {
    color: colors.text.muted,
    fontSize: 14.5,
    lineHeight: 22,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  company: {
    color: colors.text.DEFAULT,
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  period: {
    color: colors.text.dim,
    fontSize: 12,
    fontWeight: '600',
  },
  roleLine: {
    color: colors.accent.orange,
    fontSize: 13.5,
    fontWeight: '600',
    marginTop: 4,
  },
  locationDim: {
    color: colors.text.dim,
    fontSize: 12,
    marginTop: 2,
  },
  bullets: {
    marginTop: 12,
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent.orange,
    marginTop: 8,
  },
  bulletText: {
    color: colors.text.muted,
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  skillGroup: {
    marginBottom: 14,
  },
  skillTitle: {
    color: colors.text.DEFAULT,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  skillChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  skillText: {
    color: colors.text.DEFAULT,
    fontSize: 12.5,
    fontWeight: '500',
  },
  projectName: {
    color: colors.text.DEFAULT,
    fontSize: 15.5,
    fontWeight: '700',
  },
  stack: {
    color: colors.accent.blue,
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 10,
  },
  footer: {
    color: colors.text.dim,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Developer;
