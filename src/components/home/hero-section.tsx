'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsArrowRight, BsYoutube } from 'react-icons/bs';
import { arrowVariant, headerVariant, infoVariant } from '@/lib/utils/framer-variants';
import AutoplaySlider from '@/components/ui/autoplay-slider';
import { Logos } from '@/lib/data/logos';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { routes } from '@/lib/constants/page-routes';

const HeroSection: React.FC = () => {
  return (
    <motion.section className="home-section relative items-center bg-white px-3 pt-16 pb-7 sm:px-8">
      <div className="home-container my-12 w-full">
        <motion.div
          variants={headerVariant}
          animate="animate"
          initial="static"
          className="text-center text-5xl leading-[3.5rem] font-bold tracking-tight text-black sm:text-[4.5rem] sm:leading-[4.5rem] lg:text-[5.5rem] lg:leading-[6rem] 2xl:text-8xl 2xl:leading-[6.5rem]"
        >
          <p>VISUALIZE.</p>
          <p>SUMMARIZE.</p>
          <p>PREDICT.</p>
        </motion.div>

        {/* Info */}
        <motion.div variants={infoVariant} animate="animate" initial="static">
          <div className="info-container mt-4 text-center font-light text-[#222]">
            <p className="m-auto px-5 leading-relaxed sm:px-10 lg:w-3/4 lg:text-lg">
              Connect to diverse data sources, automate advanced data analysis processes generate
              dashboards, reports, & predictive insights to supercharge accuracy & efficiency.
            </p>
          </div>

          {/* Buttons */}

          <div className="buttons-container mt-8 flex items-center justify-center space-x-3 sm:space-x-5">
            <Link
              className="cursor-pointer"
              href={`${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.signup}`}
            >
              <Button type="button" size={'lg'}>
                <span>Get Started</span>
                <motion.div variants={arrowVariant} animate="animate" initial="static">
                  <BsArrowRight className="size-6" />
                </motion.div>
              </Button>
            </Link>
            <Link href={'/'}>
              <Button type="button" size={'lg'} variant={'outline'} className="border-black">
                <span>Learn More</span>
                <BsYoutube className="size-6" />
              </Button>
            </Link>
          </div>

          {/* Trusted Sources */}
          <div>
            <p className="slider-container mt-16 text-center text-base font-medium">
              INTEGRATES WITH 10+ DATA SOURCES
            </p>

            <div className="relative m-auto mt-10 w-11/12 py-3">
              <div className="slider-fade"></div>
              <AutoplaySlider>
                {Logos.map((item, index) => (
                  <Image
                    key={index}
                    src={item.item}
                    alt="Logo"
                    height={40}
                    className="img inline-block"
                  ></Image>
                ))}
              </AutoplaySlider>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
