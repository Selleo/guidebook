import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ComponentProps, FC } from 'react';
import { Platform } from 'react-native';

export type ExternalLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export const ExternalLink: FC<ExternalLinkProps> = (props) => {
  return (
    <Link
      target="_blank"
      {...props}
      // @ts-expect-error: External URLs are not typed.
      href={props.href}
      onPress={(event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}
