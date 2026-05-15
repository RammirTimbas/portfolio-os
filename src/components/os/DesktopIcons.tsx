import { apps } from "../../data/apps";

import { useWindowStore } from "../../stores/windowStore";

export default function DesktopIcons() {
  const openWindow = useWindowStore(
    (state) => state.openWindow
  );

  return (
    <div className="grid w-fit gap-6 p-6">
      {apps.map((app) => {
        const Icon = app.icon;

        return (
          <button
            key={app.id}
            onDoubleClick={() =>
              openWindow({
                id: crypto.randomUUID(),

                appId: app.id,

                title: app.title,

                position: {
                  x:
                    window.innerWidth / 2 -
                    app.defaultSize.width / 2,

                  y:
                    window.innerHeight / 2 -
                    app.defaultSize.height / 2,
                },

                size: app.defaultSize,
              })
            }
            className="
              flex
              w-20
              flex-col
              items-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-zinc-800/80
                backdrop-blur
              "
            >
              <Icon className="text-white" />
            </div>

            <span className="text-sm text-white">
              {app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}