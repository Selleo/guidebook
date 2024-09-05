import { Redirect } from 'expo-router';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { CenterView } from '@/components/CenterView';
import { getAsyncStorageItem } from '@/utilities/asyncStorage';

export const onboardingKey = 'onboarding';

export const OnboardingWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const onMount = async () => {
      const onboardingValue = await getAsyncStorageItem(onboardingKey);

      if (onboardingValue) {
        setIsOnboardingCompleted(true);
      }

      setIsLoading(false);
    };

    onMount();
  }, []);

  if (isLoading) {
    return (
      <CenterView>
        <ActivityIndicator size="large" />
      </CenterView>
    );
  }

  if (isOnboardingCompleted) {
    return <Redirect href="/sign-in" />;
  }

  return children;
};
