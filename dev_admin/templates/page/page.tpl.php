<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * The doctype, html, head and body tags are not in this template. Instead they
 * can be found in the html.tpl.php template in this directory.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/bartik.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['header']: Items for the header region.
 * - $page['footer']: Items for the footer region.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see html.tpl.php
 *
 * @ingroup themeable
 */
$page_is_mindboard = isset($_GET['q']) && $_GET['q'] == 'admin/mindboard';
?>
<div class="fullpage<?php if (!empty($page['menu_adminflex'])): ?> adminflex<?php endif; ?>">
  <div class="fulldata">

    <?php if (!empty($breadcrumb)): ?>
      <div class="breadcrumb" id="breadcrumb">
        <div class="hold pad-h">
          <div class="breadcrumb__content">
            <a href="#" class="breadcrumb__link_tour-start i-question"></a>
            <?php print $breadcrumb; ?>
          </div>
        </div>
      </div><!--breadcrumb-->
    <?php endif; ?>

    <div class="block-system">
      <div class="hold pad-h">
        <div class="tabs-content">
          <?php if (!empty($page['highlighted'])): ?>
            <div class="block-highlighted" id="highlighted">
              <?php print render($page['highlighted']); ?>
            </div>
          <?php endif; ?>
          <?php if (!empty($page['help'])): ?>
            <div class="block-help" id="help">
              <?php print render($page['help']); ?>
            </div>
          <?php endif; ?>
          <?php print render($tabs); ?>
          <?php print render($action_links); ?>
          <?php print render($tabs2); ?>
        </div>
        <div class="block-messages">
          <?php print $messages; ?>
        </div>
      </div>
    </div>

      <!--Title-->
    <div class="hold pad-h">
      <?php print render($title_suffix); ?>
      <h1 class="title page-title" id="page-title"><?php print $title; ?><?php print $title_suffix_text; ?></h1>
      <?php print render($title_suffix); ?>
    </div>

    <?php if (!empty($page['content_top'])): ?>
      <div class="top mb50">
        <div class="hold pad-h"><?php print render($page['content_top']); ?></div>
      </div>
    <?php endif; ?>


    <?php if ($page_is_mindboard): ?>
      <?php print render($page['content']); ?>
    <?php else: ?>
      <div class="content-data">
        <div class="hold pad-h"><?php print render($page['content']); ?></div>
      </div>
    <?php endif; ?>

  </div> <!--fulldata-->

  <footer>
    <div class="bottom__block pv30">
      <div class="hold pad-h">
        <div class="row middle sp-10">
          <div class="col d4 t9 m12">
            <div><?php print t('Flex copyright'); ?> <?php print date('Y'); ?></div>
          </div>
          <div class="col d6 t9 m12">
            <div class="menu inline t_grey"><?php print render($page['admin_footermenu']); ?></div>
          </div>
          <div class="col d2"></div>

        </div>

      </div>
    </div>
  </footer>

  <div id="developer-from" class="developer-from"><?php print $flex_copyright; ?></div>

</div> <!--fullpage-->

<?php if (!empty($page['menu_adminflex'])): ?>
  <div class="menu_adminflex__wrap">
    <div class="additions">
      <a href="/" class="logo__wrap">
        <div id="logo-preloader" class="preloader">
          <div class="preloader__content">
            <div class="spinner box_1 spinner"></div>
            <div class="spinner box_2 delay_1"></div>
            <div class="spinner box_3 delay_2"></div>
            <div class="spinner box_4 delay_3"></div>
            <div class="box_5"></div>
          </div>
        </div>
      </a>
      <div class="menu_adminflex"><?php print render($page['menu_adminflex_add']); ?></div>
    </div>
    <div class="menu_adminflex operations"><?php print render($page['menu_adminflex']); ?></div>
  </div>
<?php endif; ?>

<!--Preloader-->
<div id="preloader" class="preloader">
  <div class="preloader__content">
    <div class="spinner box_1 spinner"></div>
    <div class="spinner box_2 delay_1"></div>
    <div class="spinner box_3 delay_2"></div>
    <div class="spinner box_4 delay_3"></div>
    <div class="box_5"></div>
  </div>

</div>

<?php if (!empty($page['hidden'])): ?>
  <div id="hidden" class="hidden">
    <?php print render($page['hidden']); ?>
  </div>
<?php endif; ?>

<div id="userid" class="hidden"><?php global $user; print $user->uid; ?></div>




