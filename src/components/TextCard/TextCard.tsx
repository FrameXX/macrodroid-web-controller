import { PropsWithChildren } from "react";
import "./TextCard.scss";
import { R_Icon } from "../Icon/Icon";
import { useDefaultProps } from "../../modules/use_default_props";
import { R_Accordion } from "../Accordion/Accordion";
import { motion } from "framer-motion";

interface TextCardProps extends PropsWithChildren {
  iconId?: string;
  className?: string;
  hidden?: boolean;
  color?: string;
}

const defaultProps: Partial<TextCardProps> = {
  hidden: false,
};

export function R_TextCard(requiredProps: TextCardProps) {
  const props = useDefaultProps(requiredProps, defaultProps);
  return (
    <R_Accordion open={!props.hidden}>
      <motion.div
        animate={{ color: props.color }}
        className={`text-card ${props.className}`}
      >
        {props.iconId && <R_Icon iconId={props.iconId} />}
        <div>{props.children}</div>
      </motion.div>
    </R_Accordion>
  );
}
