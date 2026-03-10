<script lang="ts">
  import { keyMap, shortcutKey } from "./keymap.js";

  $effect(() => {
    function handleKeydown(event: KeyboardEvent): void {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (target.isContentEditable) return;

      const handler = keyMap[shortcutKey(event)];
      if (handler) {
        event.preventDefault();
        handler();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });
</script>
