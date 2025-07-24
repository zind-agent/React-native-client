'use client';
import React from 'react';
import { createButton } from '@gluestack-ui/button';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { withStyleContext, useStyleContext } from '@gluestack-ui/nativewind-utils/withStyleContext';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/icon';
import { useDynamicFont } from '@/hooks/useDynamicFont';
import { useDynamicStyle } from '@/hooks/useDynamicStyle';

const SCOPE = 'BUTTON';

const Root = withStyleContext(Pressable, SCOPE);

const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

const buttonStyle = tva({
  base: 'group/button rounded flex-row items-center justify-center gap-2 bg-primary text-white data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40',

  variants: {
    action: {
      primary: 'bg-primary text-white data-[hover=true]:bg-primary-light data-[active=true]:bg-primary-dark  data-[focus-visible=true]:web:ring-primary',
      secondary:
        'bg-secondary text-white border border-secondary data-[hover=true]:bg-secondary/90 data-[active=true]:bg-secondary/80 data-[hover=true]:border-secondary/90 data-[active=true]:border-secondary/80 data-[focus-visible=true]:web:ring-secondary',
      positive:
        'bg-success text-black border border-success data-[hover=true]:bg-success/90 data-[active=true]:bg-success/80 data-[hover=true]:border-success/90 data-[active=true]:border-success/80 data-[focus-visible=true]:web:ring-success',
      negative:
        'bg-red-500 text-white border border-red-500 data-[hover=true]:bg-red-600 data-[active=true]:bg-red-700 data-[hover=true]:border-red-600 data-[active=true]:border-red-700 data-[focus-visible=true]:web:ring-red-500',
      default: 'bg-transparent text-text border border-gray-300 data-[hover=true]:bg-background data-[active=true]:bg-gray-100',
    },

    variant: {
      link: 'bg-transparent px-0 text-primary underline',
      outline: 'bg-transparent border border-current text-current data-[hover=true]:bg-background data-[active=true]:bg-transparent',
      solid: '',
    },

    size: {
      xs: 'px-3.5 h-8',
      sm: 'px-4 h-9',
      md: 'px-5 h-10',
      lg: 'px-6 h-11',
      xl: 'px-7 h-12',
    },
  },
  compoundVariants: [
    {
      action: 'primary',
      variant: 'link',
      class: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    {
      action: 'secondary',
      variant: 'link',
      class: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    {
      action: 'positive',
      variant: 'link',
      class: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    {
      action: 'negative',
      variant: 'link',
      class: 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    {
      action: 'primary',
      variant: 'outline',
      class: 'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
    },
    {
      action: 'secondary',
      variant: 'outline',
      class: 'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
    },
    {
      action: 'positive',
      variant: 'outline',
      class: 'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
    },
    {
      action: 'negative',
      variant: 'outline',
      class: 'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
    },
  ],
});

const buttonTextStyle = tva({
  base: 'text-text font-semibold web:select-none',

  parentVariants: {
    action: {
      primary: 'text-white',
      secondary: 'text-white',
      positive: 'text-black',
      negative: 'text-white',
    },

    variant: {
      link: 'underline data-[hover=true]:underline data-[active=true]:underline',
      outline: 'text-inherit',
      solid: 'text-inherit',
    },

    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },

  parentCompoundVariants: [
    {
      variant: 'solid',
      action: 'primary',
      class: 'text-white',
    },
    {
      variant: 'solid',
      action: 'secondary',
      class: 'text-white',
    },
    {
      variant: 'solid',
      action: 'positive',
      class: 'text-black',
    },
    {
      variant: 'solid',
      action: 'negative',
      class: 'text-white',
    },
    {
      variant: 'outline',
      action: 'primary',
      class: 'text-primary data-[hover=true]:text-primary-light data-[active=true]:text-primary-dark',
    },
    {
      variant: 'outline',
      action: 'secondary',
      class: 'text-secondary data-[hover=true]:text-secondary/90 data-[active=true]:text-secondary/80',
    },
    {
      variant: 'outline',
      action: 'positive',
      class: 'text-success data-[hover=true]:text-success/90 data-[active=true]:text-success/80',
    },
    {
      variant: 'outline',
      action: 'negative',
      class: 'text-red-500 data-[hover=true]:text-red-600 data-[active=true]:text-red-700',
    },
  ],
});

const buttonIconStyle = tva({
  base: 'fill-none',
  parentVariants: {
    variant: {
      link: 'data-[hover=true]:underline data-[active=true]:underline',
      outline: '',
      solid: 'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
    },
    size: {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-[18px] w-[18px]',
      lg: 'h-[18px] w-[18px]',
      xl: 'h-5 w-5',
    },
    action: {
      primary: 'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
      secondary: 'text-typography-500 data-[hover=true]:text-typography-600 data-[active=true]:text-typography-700',
      positive: 'text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700',

      negative: 'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
    },
  },
  parentCompoundVariants: [
    {
      variant: 'solid',
      action: 'primary',
      class: 'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
    },
    {
      variant: 'solid',
      action: 'secondary',
      class: 'text-typography-800 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800',
    },
    {
      variant: 'solid',
      action: 'positive',
      class: 'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
    },
    {
      variant: 'solid',
      action: 'negative',
      class: 'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
    },
  ],
});

const buttonGroupStyle = tva({
  base: '',
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
      '2xl': 'gap-6',
      '3xl': 'gap-7',
      '4xl': 'gap-8',
    },
    isAttached: {
      true: 'gap-0',
    },
    flexDirection: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
  },
});

type IButtonProps = Omit<React.ComponentPropsWithoutRef<typeof UIButton>, 'context'> & VariantProps<typeof buttonStyle> & { className?: string };

const Button = React.forwardRef<React.ElementRef<typeof UIButton>, IButtonProps>(({ className, style, variant = 'solid', size = 'md', action = 'primary', ...props }, ref) => {
  const dynamicStyle = useDynamicStyle(style);
  return <UIButton ref={ref} {...props} className={buttonStyle({ variant, size, action, class: className })} context={{ variant, size, action }} style={dynamicStyle} />;
});

type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> & VariantProps<typeof buttonTextStyle> & { className?: string };

const ButtonText = React.forwardRef<React.ElementRef<typeof UIButton.Text>, IButtonTextProps>(({ className, variant, style, size, action, ...props }, ref) => {
  const { variant: parentVariant, size: parentSize, action: parentAction } = useStyleContext(SCOPE);
  const dynamicFont = useDynamicFont(style);

  return (
    <UIButton.Text
      ref={ref}
      {...props}
      className={buttonTextStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
          action: parentAction,
        },
        variant,
        size,
        action,
        class: className,
      })}
      style={dynamicFont}
    />
  );
});

const ButtonSpinner = UIButton.Spinner;

type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const ButtonIcon = React.forwardRef<React.ElementRef<typeof UIButton.Icon>, IButtonIcon>(({ className, size, ...props }, ref) => {
  const { variant: parentVariant, size: parentSize, action: parentAction } = useStyleContext(SCOPE);

  if (typeof size === 'number') {
    return <UIButton.Icon ref={ref} {...props} className={buttonIconStyle({ class: className })} size={size} />;
  } else if ((props.height !== undefined || props.width !== undefined) && size === undefined) {
    return <UIButton.Icon ref={ref} {...props} className={buttonIconStyle({ class: className })} />;
  }
  return (
    <UIButton.Icon
      {...props}
      className={buttonIconStyle({
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
          action: parentAction,
        },
        size,
        class: className,
      })}
      ref={ref}
    />
  );
});

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> & VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<React.ElementRef<typeof UIButton.Group>, IButtonGroupProps>(({ className, space = 'md', isAttached = false, flexDirection = 'column', ...props }, ref) => {
  return (
    <UIButton.Group
      className={buttonGroupStyle({
        class: className,
        space,
        isAttached,
        flexDirection,
      })}
      {...props}
      ref={ref}
    />
  );
});

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
