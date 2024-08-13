import { Instagram, MailIcon, ShieldCheckIcon } from 'lucide-react';
import Link from 'next/link';

import { UnbCollectionIcon, WhatsAppIcon } from '@/assets';
import { Badge } from '@/components/ui/badge';

import { AnimatedSubscribeButton } from './newsletter-subscribe';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-4 mt-8 pb-16 sm:py-12 sm:px-0 px-2">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Link href="#" className="flex items-center" prefetch={false}>
            <UnbCollectionIcon className="text-white" />
          </Link>
          <p className="text-gray-400">
            UNB Collection é um projeto que introduz o estilo Streetwear nos campus da Universidade
            de Brasília
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-50 dark:text-gray-50">Segurança</h4>
          <div className="flex flex-col gap-4">
            <Badge variant="secondary" className="flex gap-2 py-1 w-fit">
              <ShieldCheckIcon className="text-blue-700" />
              Encriptamento SSL
            </Badge>
            <p className="text-gray-400 dark:text-gray-400">
              Sua segurança é nossa prioridade. Todas as suas informações são protegidas com
              criptografia SSL, garantindo uma navegação segura em nosso site.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-50 dark:text-gray-50">
            Se conecte com a gente
          </h4>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-gray-400">
                Inscreva-se na nossa Newsletter e receba promoções exclusivas, novidades de coleções
                e muito mais!
              </p>
              <AnimatedSubscribeButton />
            </div>
            {process.env.NEXT_PUBLIC_INSTAGRAM ? (
              <Link
                href={`https://www.instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM.replace('@', '')}/`}
                prefetch={false}
                target="_blank"
                className="flex gap-2 items-center "
              >
                <Instagram className="h-6 w-6 text-[#E4405F]" />
                <span className="text-gray-400">{process.env.NEXT_PUBLIC_INSTAGRAM}</span>
              </Link>
            ) : null}

            {process.env.NEXT_PUBLIC_WHATSAPP ? (
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP.replace(/\D/g, '')}?text=Olá%20👋,%20vim%20pelo%20site%20UNB%20Collection`}
                prefetch={false}
                target="_blank"
                className="flex gap-2 items-center"
              >
                <WhatsAppIcon className="fill-[#25D366] h-6 w-6" />
                <span className="text-gray-400">{process.env.NEXT_PUBLIC_WHATSAPP}</span>
              </Link>
            ) : null}

            {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? (
              <div className="flex items-center space-x-2">
                <MailIcon className="h-6 w-6 text-blue-500" />
                <span className="text-gray-400">{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
};
