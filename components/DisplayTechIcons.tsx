import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => {
        return (
          <div
            className={cn(
              "relative group bg-dark-300 rounded-full p-2 flex-center",index >= 1 && "-ml-3"
            )}
            key={index}
          >
            <span className="tech-tooltip">{tech}</span>
            <img
              src={url}
              alt={tech}
              width={100}
              height={100}
              className="size-5"
            />
          </div>
        );
      })}
    </div>
  );
};

export default DisplayTechIcons;
