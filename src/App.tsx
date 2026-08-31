/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Home from './components/Home';
import About from './components/About';
import { RedNoirBackground } from './components/ui/red-noir-background';
import { CustomCursor } from './components/ui/CustomCursor';

export default function App() {
  const [page, setPage] = useState<'home' | 'about'>('home');

  return (
    <>
      <CustomCursor />
      <RedNoirBackground>
        <AnimatePresence mode="wait">
          {page === 'home' ? (
            <Home key="home" onEnter={() => setPage('about')} />
          ) : (
            <About key="about" onBack={() => setPage('home')} />
          )}
        </AnimatePresence>
      </RedNoirBackground>
    </>
  );
}
