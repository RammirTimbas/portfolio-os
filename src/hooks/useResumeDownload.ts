import { profileData } from "../data/profile";

export const useResumeDownload = () => {
  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = profileData.resumeUrl;
    link.download = `${profileData.name.replace(/\s+/g, "_")}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { downloadResume };
};
