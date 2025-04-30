import {Locale, useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import PageLayout from '@/components/PageLayout';
import {Pump} from 'basehub/react-pump';

type Props = {
  params: Promise<{locale: Locale}>;
};

export default function PathnamesPage({params}: Props) {
  const {locale} = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations('PathnamesPage');

  return (
    <PageLayout title={t('title')}>
      <div className="max-w-[490px]">
        {t.rich('description', {
          p: (chunks) => <p className="mt-4">{chunks}</p>,
          code: (chunks) => (
            <code className="font-mono text-white">{chunks}</code>
          )
        })}

        <Pump
          queries={[
            {
              blog: {
                __args: {variants: {language: locale}},
                _title: true,
                posts: {
                  items: {
                    _id: true,
                    _title: true
                  }
                }
              }
            }
          ]}
        >
          {async ([{blog}]) => {
            'use server';
            return (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold">{blog._title}</h2>
                <ol className="mt-4 list-decimal space-y-2 list-inside">
                  {blog.posts.items.map((post) => (
                    <li key={post._id}>{post._title}</li>
                  ))}
                </ol>
              </div>
            );
          }}
        </Pump>
      </div>
    </PageLayout>
  );
}
