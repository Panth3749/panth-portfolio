"use client";

import React from 'react';
import { SettleProjectStack } from './SettleProjectStack';

export const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="relative">
      <SettleProjectStack />
    </section>
  );
};

export default ProjectsSection;
