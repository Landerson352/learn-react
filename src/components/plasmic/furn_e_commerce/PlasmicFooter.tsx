// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: izpLuD9XfjEg4waoVkj7iA
// Component: UD_H8su_m919k
import * as React from 'react';

import * as p from '@plasmicapp/react-web';
import * as ph from '@plasmicapp/host';

import {
  hasVariant,
  classNames,
  wrapWithClassName,
  createPlasmicElementProxy,
  makeFragment,
  MultiChoiceArg,
  SingleBooleanChoiceArg,
  SingleChoiceArg,
  pick,
  omit,
  useTrigger,
  StrictProps,
  deriveRenderOpts,
  ensureGlobalVariants,
} from '@plasmicapp/react-web';
import IconLink from '../../IconLink'; // plasmic-import: e9zLDLifxsP30Z/component

import { useScreenVariants as useScreenVariants_9LdGg6IuIx6DD } from './PlasmicGlobalVariant__Screen'; // plasmic-import: 9LdGg6iuIX6dD-/globalVariant

import '@plasmicapp/react-web/lib/plasmic.css';

import plasmic_library_plasmic_color_type_css from '../library_plasmic_color_type/plasmic_library_plasmic_color_type.module.css'; // plasmic-import: seaQhLVS4bbjiGvJJrRwyL/projectcss
import projectcss from './plasmic_furn_e_commerce.module.css'; // plasmic-import: izpLuD9XfjEg4waoVkj7iA/projectcss
import sty from './PlasmicFooter.module.css'; // plasmic-import: UD_H8su_m919k/css

import LocationArrowIcon from './icons/PlasmicIcon__LocationArrow'; // plasmic-import: GoRCmRbc8FkVW/icon
import FacebookIcon from './icons/PlasmicIcon__Facebook'; // plasmic-import: PeOpgGn0BcCwj/icon
import InstagramIcon from './icons/PlasmicIcon__Instagram'; // plasmic-import: RJx8AMviA1YUh/icon
import LinkedinIcon from './icons/PlasmicIcon__Linkedin'; // plasmic-import: 1-lXxs2Ob27Br/icon

export type PlasmicFooter__VariantMembers = {};

export type PlasmicFooter__VariantsArgs = {};
type VariantPropType = keyof PlasmicFooter__VariantsArgs;
export const PlasmicFooter__VariantProps = new Array<VariantPropType>();

export type PlasmicFooter__ArgsType = {};
type ArgPropType = keyof PlasmicFooter__ArgsType;
export const PlasmicFooter__ArgProps = new Array<ArgPropType>();

export type PlasmicFooter__OverridesType = {
  root?: p.Flex<'div'>;
  textInput?: p.Flex<'input'>;
  button?: p.Flex<'button'>;
  textbox?: p.Flex<'input'>;
};

export interface DefaultFooterProps {
  className?: string;
}

function PlasmicFooter__RenderFunc(props: {
  variants: PlasmicFooter__VariantsArgs;
  args: PlasmicFooter__ArgsType;
  overrides: PlasmicFooter__OverridesType;

  forNode?: string;
}) {
  const { variants, args, overrides, forNode } = props;

  const globalVariants = ensureGlobalVariants({
    screen: useScreenVariants_9LdGg6IuIx6DD(),
  });

  return (
    <div
      data-plasmic-name={'root'}
      data-plasmic-override={overrides.root}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      className={classNames(
        projectcss.all,
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_tokens,
        plasmic_library_plasmic_color_type_css.plasmic_tokens,
        sty.root
      )}
    >
      <p.Stack
        as={'div'}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__i7FCc)}
      >
        <p.Stack
          as={'div'}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox___9HZuN)}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__fWuLk
            )}
          >
            {'Information'}
          </div>

          <p.Stack
            as={'div'}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__pM2U0)}
          >
            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__gmhGd
              )}
              href={'#' as const}
            >
              {'About Us'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__lJ0A
              )}
              href={'#' as const}
            >
              {'Contact Us'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__oSv4M
              )}
              href={'#' as const}
            >
              {'News'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link___4Raw4
              )}
              href={'#' as const}
            >
              {'Store'}
            </a>
          </p.Stack>
        </p.Stack>

        <p.Stack
          as={'div'}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox___3SAoa)}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text___3FfHa
            )}
          >
            {'Collections'}
          </div>

          <p.Stack
            as={'div'}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__x459T)}
          >
            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__p8KHd
              )}
              href={'#' as const}
            >
              {'Wooden Chair'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__rkzBn
              )}
              href={'#' as const}
            >
              {'Royal Cloth Sofa'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__cCinh
              )}
              href={'#' as const}
            >
              {'Accent Chair'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__hJ69F
              )}
              href={'#' as const}
            >
              {'Bed'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__fR9Jz
              )}
              href={'#' as const}
            >
              {'Hanging Lamp'}
            </a>
          </p.Stack>
        </p.Stack>

        <p.Stack
          as={'div'}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__vYcSs)}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__cios2
            )}
          >
            {'My Accounts'}
          </div>

          <p.Stack
            as={'div'}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__ptxtZ)}
          >
            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__mtDli
              )}
              href={'#' as const}
            >
              {'My Account'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__eauKa
              )}
              href={'#' as const}
            >
              {'Wishlist'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__nx7Xg
              )}
              href={'#' as const}
            >
              {'Community'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__sswei
              )}
              href={'#' as const}
            >
              {'Order History'}
            </a>

            <a
              className={classNames(
                projectcss.all,
                projectcss.a,
                projectcss.__wab_text,
                sty.link__c1NiZ
              )}
              href={'#' as const}
            >
              {'My Cart'}
            </a>
          </p.Stack>
        </p.Stack>

        <p.Stack
          as={'div'}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox___5B9RF)}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__eLkFo
            )}
          >
            {'Newsletter'}
          </div>

          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text___42OUc
            )}
          >
            {'Subscribe to get latest news, updates, and information'}
          </div>

          <div className={classNames(projectcss.all, sty.freeBox___0Kf0R)}>
            <input
              data-plasmic-name={'textInput'}
              data-plasmic-override={overrides.textInput ?? overrides.textbox}
              className={classNames(
                projectcss.all,
                projectcss.input,
                sty.textInput
              )}
              placeholder={'Enter Email Here...' as const}
              size={1 as const}
              type={'text' as const}
              value={'' as const}
            />

            <button
              data-plasmic-name={'button'}
              data-plasmic-override={overrides.button}
              className={classNames(
                projectcss.all,
                projectcss.button,
                sty.button
              )}
            >
              <LocationArrowIcon
                className={classNames(projectcss.all, sty.svg__nZjq)}
                role={'img'}
              />
            </button>
          </div>
        </p.Stack>
      </p.Stack>

      <p.Stack
        as={'div'}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__ig09)}
      >
        <p.Stack
          as={'div'}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__anDnf)}
        >
          <IconLink
            className={classNames('__wab_instance', sty.iconLink__vhinn)}
            icon={
              <FacebookIcon
                className={classNames(projectcss.all, sty.svg__rYWz2)}
                role={'img'}
              />
            }
          />

          <IconLink
            className={classNames('__wab_instance', sty.iconLink__pKzxT)}
            icon={
              <InstagramIcon
                className={classNames(projectcss.all, sty.svg__apujv)}
                role={'img'}
              />
            }
          />

          <IconLink
            className={classNames('__wab_instance', sty.iconLink__byHBs)}
            icon={
              <LinkedinIcon
                className={classNames(projectcss.all, sty.svg__xQtkC)}
                role={'img'}
              />
            }
          />
        </p.Stack>

        <div className={classNames(projectcss.all, sty.freeBox__ze9I)}>
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__ueWqc
            )}
          >
            {'© Copyright. '}
          </div>

          <a
            className={classNames(
              projectcss.all,
              projectcss.a,
              projectcss.__wab_text,
              sty.link__nglpa
            )}
            href={'https://www.plasmic.app/' as const}
          >
            {'Made by Plasmic. '}
          </a>

          <a
            className={classNames(
              projectcss.all,
              projectcss.a,
              projectcss.__wab_text,
              sty.link__c8Y
            )}
            href={'https://www.themesine.com/' as const}
          >
            {'Inspired by Themesine.'}
          </a>
        </div>
      </p.Stack>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ['root', 'textInput', 'textbox', 'button'],
  textInput: ['textInput', 'textbox'],
  button: ['button'],
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  typeof PlasmicDescendants[T][number];
type NodeDefaultElementType = {
  root: 'div';
  textInput: 'input';
  button: 'button';
};

type ReservedPropsType = 'variants' | 'args' | 'overrides';
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicFooter__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicFooter__VariantsArgs;
    args?: PlasmicFooter__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicFooter__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    // Specify args directly as props
    Omit<PlasmicFooter__ArgsType, ReservedPropsType> &
    // Specify overrides for each element directly as props
    Omit<
      NodeOverridesType<T>,
      ReservedPropsType | VariantPropType | ArgPropType
    > &
    // Specify props for the root element
    Omit<
      Partial<React.ComponentProps<NodeDefaultElementType[T]>>,
      ReservedPropsType | VariantPropType | ArgPropType | DescendantsType<T>
    >;

function makeNodeComponent<NodeName extends NodeNameType>(nodeName: NodeName) {
  type PropsType = NodeComponentProps<NodeName> & { key?: React.Key };
  const func = function <T extends PropsType>(
    props: T & StrictProps<T, PropsType>
  ) {
    const { variants, args, overrides } = deriveRenderOpts(props, {
      name: nodeName,
      descendantNames: [...PlasmicDescendants[nodeName]],
      internalArgPropNames: PlasmicFooter__ArgProps,
      internalVariantPropNames: PlasmicFooter__VariantProps,
    });

    return PlasmicFooter__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName,
    });
  };
  if (nodeName === 'root') {
    func.displayName = 'PlasmicFooter';
  } else {
    func.displayName = `PlasmicFooter.${nodeName}`;
  }
  return func;
}

export const PlasmicFooter = Object.assign(
  // Top-level PlasmicFooter renders the root element
  makeNodeComponent('root'),
  {
    // Helper components rendering sub-elements
    textInput: makeNodeComponent('textInput'),
    button: makeNodeComponent('button'),

    // Metadata about props expected for PlasmicFooter
    internalVariantProps: PlasmicFooter__VariantProps,
    internalArgProps: PlasmicFooter__ArgProps,
  }
);

export default PlasmicFooter;
/* prettier-ignore-end */
