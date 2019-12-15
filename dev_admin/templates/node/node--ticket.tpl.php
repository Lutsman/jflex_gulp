<?php

/**
 * @file
 * Default theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 *   or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct URL of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 *   template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type; for example, "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type; for example, story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode; for example, "full", "teaser".
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined; for example, $node->body becomes $body. When needing to
 * access a field's raw values, developers/themers are strongly encouraged to
 * use these variables. Otherwise they will have to explicitly specify the
 * desired field language; for example, $node->body['en'], thus overriding any
 * language negotiation rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
 *
 * @ingroup themeable
 */

$box_class = $partner = '';
if (!empty($content['comments'])) {
  $autor = $content['comments']['#node']->uid;
  $autor = user_load($autor);
  if (in_array('support', $autor->roles)) {
    $box_class = ' support';
  }
  elseif (in_array('partner', $autor->roles)) {
    $box_class = ' partner';
    $partner = '<span class="partner m-l-5 m-r-5">(' . t('partner') . ')</span>';
  }
}
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> task"<?php print $attributes; ?>>
  <?php if (!empty($content['field_ticket_topic'])): ?>
    <?php print drupal_render($content['field_ticket_topic']); ?>
  <?php endif; ?>
  <div class="control mb30">
    <?php if (!empty($content['field_ref_task_ticket'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ref_task_ticket']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_client'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ticket_client']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_manager'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ticket_manager']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_author'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ticket_author']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_execute'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ticket_execute']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_status'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ticket_status']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_priority'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ticket_priority']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_department'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ticket_department']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_source'])): ?>
      <div class="fl mr20"><?php print drupal_render($content['field_ticket_source']); ?></div>
    <?php endif; ?>
    <?php if (!empty($content['field_ticket_note'])): ?>
      <div class="fl w100"><?php print drupal_render($content['field_ticket_note']); ?></div>
    <?php endif; ?>
  </div>

  <div class="control mb30">
    <div id="choose-date" class="choose-date fl mr40 mb20"><?php print drupal_render($content['field_reminder_time']); ?></div>

    <?php if (!empty($content['field_reminder_regular']) || !empty($content['field_reminder_date']) || !empty($content['field_reminder_period']) || !empty($content['field_reminder_interval'])): ?>
      <div class="reminder__wrap fl mr40 mb20">
        <?php if (!empty($content['field_reminder_regular']) || !empty($content['field_reminder_date'])): ?>
          <div id="reminder-date" class="reminder-date fl mr20 js__checkboxTogglerDelegated" data-ctd-target=".reminder-period, .reminder-interval">
            <?php if (!empty($content['field_reminder_regular'])): ?>
              <?php print drupal_render($content['field_reminder_regular']); ?>
            <?php endif; ?>
            <?php if (!empty($content['field_reminder_date'])): ?>
              <?php print drupal_render($content['field_reminder_date']); ?>
            <?php endif; ?>
          </div>
        <?php endif; ?>
        <?php if (!empty($content['field_reminder_period'])): ?>
          <div class="reminder-period fl mr20"><?php print drupal_render($content['field_reminder_period']); ?></div>
        <?php endif; ?>
        <?php if (!empty($content['field_reminder_interval'])): ?>
          <div class="reminder-interval fl">
            <div class="fl"><?php print drupal_render($content['field_reminder_interval']); ?></div>
          </div>
        <?php endif; ?>
      </div>
      <?php if (!empty($content['field_reminder_type'])): ?>
        <div class="reminder-notification-type fl">
          <div class="fl"><?php print drupal_render($content['field_reminder_type']); ?></div>
        </div>
      <?php endif; ?>
    </div>
  <?php endif; ?>

  <?php if ($body_render = drupal_render($content['body'])): ?>
    <div class="startmessage">
      <div class="author m-description submitted<?php print $box_class; ?>"><?php
        print $submitted;
        print $partner; ?>
      </div>
      <?php print $body_render; ?>
    </div>
  <?php endif; ?>

  <?php if (!empty($content['comments'])): ?>
    <div class="fl w100 mt20">
      <div class="title"><?php print t('Comments'); ?></div>
      <?php print render($content['comments']); ?>
    </div>
  <?php endif; ?>
</div>
