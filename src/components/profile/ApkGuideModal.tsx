import React from 'react';
import { Smartphone, Terminal, Shield, CheckCircle, Copy } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    onShowToast('Copied command to clipboard!');
  };

  const steps = [
    {
      step: '1',
      title: 'Install Capacitor Dependencies',
      desc: 'Add Capacitor core, CLI, and Android runtime plugins:',
      cmd: 'npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/geolocation',
    },
    {
      step: '2',
      title: 'Build the React Web Application',
      desc: 'Generate production-ready web assets in the /dist directory:',
      cmd: 'npm run build',
    },
    {
      step: '3',
      title: 'Initialize and Add Android Platform',
      desc: 'Generate the native Android Studio project files:',
      cmd: 'npx cap add android && npx cap sync',
    },
    {
      step: '4',
      title: 'Configure Android Permissions',
      desc: 'Ensure android/app/src/main/AndroidManifest.xml contains location permissions:',
      xml: `<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`,
    },
    {
      step: '5',
      title: 'Build & Generate Debug APK',
      desc: 'Compile the debug APK using Gradle wrapper or Android Studio:',
      cmd: './gradlew assembleDebug',
      output: 'APK Output: android/app/build/outputs/apk/debug/app-debug.apk',
    },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Android APK Packaging Guide"
      subtitle="Capacitor build setup for IET DAVV RollCall"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-[#7FE3C0]/10 border border-[#7FE3C0]/20 flex items-start gap-2.5">
          <Smartphone size={18} className="text-[#7FE3C0] shrink-0 mt-0.5" />
          <p className="text-[#F2F2F0] leading-relaxed">
            RollCall is built with mobile-first architecture and includes <code className="text-[#7FE3C0]">capacitor.config.ts</code> for zero-friction Android packaging.
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((st) => (
            <div
              key={st.step}
              className="card-raised rounded-2xl p-3.5 border border-white/[0.06] space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7FE3C0]/20 text-[#7FE3C0] font-bold text-[11px] flex items-center justify-center shrink-0">
                  {st.step}
                </span>
                <h4 className="font-semibold text-[#F2F2F0] text-xs">{st.title}</h4>
              </div>
              <p className="text-[11px] text-[#8A8A93] pl-7">{st.desc}</p>

              {st.cmd && (
                <div className="ml-7 flex items-center justify-between p-2 rounded-xl bg-[#131316] border border-white/[0.04] font-mono text-[11px] text-[#7FE3C0]">
                  <span className="truncate">{st.cmd}</span>
                  <button
                    onClick={() => copyCommand(st.cmd!)}
                    className="p-1 rounded text-[#8A8A93] hover:text-[#F2F2F0] shrink-0 ml-2"
                    title="Copy command"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              )}

              {st.xml && (
                <div className="ml-7 p-2 rounded-xl bg-[#131316] border border-white/[0.04] font-mono text-[10px] text-amber-300 whitespace-pre-wrap">
                  {st.xml}
                </div>
              )}

              {st.output && (
                <p className="ml-7 text-[10px] text-[#5A5A63] font-mono">
                  {st.output}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};
