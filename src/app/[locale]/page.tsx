import {Pump} from 'basehub/react-pump';
import {RichText} from 'basehub/react-rich-text';
import {Locale, useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {use} from 'react';
import PageLayout from '@/components/PageLayout';

type Props = {
  params: Promise<{locale: Locale}>;
};

export default function IndexPage({params}: Props) {
  const {locale} = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations('IndexPage');

  return (
    <Pump
      queries={[
        {
          blog: {
            __args: {variants: {language: locale}},
            _title: true,
            subtitle: {json: {content: true}}
          }
        }
      ]}
      bind={{t}}
    >
      {async ({t}, [{blog}]) => {
        'use server';
        return (
          <PageLayout title={blog._title}>
            <p className="max-w-[590px]">
              {t.rich('description', {
                code: (chunks) => (
                  <code className="font-mono text-white">{chunks}</code>
                )
              })}
            </p>
            <div className="mt-6">
              <RichText content={blog.subtitle.json.content} />
            </div>
          </PageLayout>
        );
      }}
    </Pump>
  );
}
