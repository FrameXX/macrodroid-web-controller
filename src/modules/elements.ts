export async function hideSplashscreen() {
  const splashscreen = document.getElementById("splashscreen");
  if (!splashscreen) throw Error("Splashscreen couldn't be found in DOM.");
  splashscreen.classList.add("faded");
  await waitForTransitionEnd(splashscreen, "opacity");
  splashscreen.hidden = true;
}

export async function waitForTransitionEnd(
  element: HTMLElement | SVGElement,
  propertyName?: string,
  abortionTimoutMs: number = 1000,
): Promise<void> {
  return new Promise((resolve) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resolve();
      return;
    }
    const abortionTimeout = setTimeout(() => {
      resolve();
      console.warn(
        `Waiting for transition was forcefully aborted after ${abortionTimoutMs} miliseconds.`,
      );
    }, abortionTimoutMs);

    element.addEventListener("transitionend", (event: Event) => {
      if (!(event instanceof TransitionEvent)) {
        console.error(
          "Transitionend listener did not return a TransitionEvent.",
        );
        return;
      }
      if (!propertyName || event.propertyName === propertyName) {
        clearTimeout(abortionTimeout);
        resolve();
      }
    });
  });
}
