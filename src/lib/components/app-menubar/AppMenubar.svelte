<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
  import { MENU_DEFINITION } from "./menu-definition.js";
</script>

<Menubar.Root class="w-full rounded-none border-x-0 border-t-0 px-2">
  {#each MENU_DEFINITION as group}
    <Menubar.Menu>
      <Menubar.Trigger>{group.label}</Menubar.Trigger>
      <Menubar.Content>
        {#each group.items as item}
          <Menubar.Item disabled={item.disabled ?? false} onclick={item.action ?? (() => {})}>
            {item.label}
          </Menubar.Item>
        {/each}
      </Menubar.Content>
    </Menubar.Menu>
  {/each}
</Menubar.Root>
