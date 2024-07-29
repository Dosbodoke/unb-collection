import { Instagram, MailIcon, ShieldCheckIcon } from 'lucide-react';
import Link from 'next/link';

import { UnbCollectionIcon, WhatsAppIcon } from '@/assets';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { AnimatedSubscribeButton } from './animated-subscribe-button';

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
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input className="text-white" type="email" placeholder="Seu email" />
                <AnimatedSubscribeButton />
              </div>
            </div>
            <Link
              href="https://www.instagram.com/unb_collection/"
              prefetch={false}
              target="_blank"
              className="flex gap-2 items-center "
            >
              <Instagram className="h-6 w-6 text-[#E4405F]" />
              <span className="text-gray-400">@unb_collection</span>
            </Link>

            <Link
              href="https://wa.link/0h6x8c"
              prefetch={false}
              target="_blank"
              className="flex gap-2 items-center "
            >
              <WhatsAppIcon className="fill-[#25D366] h-6 w-6" />
              <span className="text-gray-400">+55 (61) 98295-9436</span>
            </Link>

            <div className="flex items-center space-x-2">
              <MailIcon className="h-6 w-6 text-blue-500" />
              <span className="text-gray-400">unb-collection@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
