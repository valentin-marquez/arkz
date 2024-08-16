create view
  public.interception_team_nikke_details as
select
  tn.id as team_nikke_id,
  tn.team_id,
  tn.nikke_id,
  tn."position",
  n.name,
  n.slug,
  n.icon_url,
  n.full_image_url,
  n.rarity,
  n.element,
  n.weapon_type,
  n.burst,
  n.manufacturer
from
  interception_team_nikkes tn
  join nikkes n on tn.nikke_id = n.id;

  create view
  public.interception_teams_with_votes as
select
  t.id as team_id,
  t.user_id,
  t.mode_id,
  t.boss_id,
  t.comment,
  t.game_version_id,
  t.created_at,
  coalesce(sum(v.vote), 0::bigint) as total_votes,
  p.username,
  p.avatar_url
from
  interception_teams t
  left join votes v on t.id = v.team_id
  left join profiles p on t.user_id = p.id
group by
  t.id,
  p.username,
  p.avatar_url;

  create view
  public.interception_teams_with_votes_and_boss as
select
  t.id as team_id,
  t.user_id,
  t.mode_id,
  t.boss_id,
  t.comment,
  t.game_version_id,
  t.created_at,
  coalesce(sum(v.vote), 0::bigint) as total_votes,
  p.username,
  p.avatar_url,
  b.name,
  b.image_url,
  b.description,
  b.element,
  b.weak_element,
  b.slug
from
  interception_teams t
  left join votes v on t.id = v.team_id
  left join profiles p on t.user_id = p.id
  left join bosses b on t.boss_id = b.id
group by
  t.id,
  p.username,
  p.avatar_url,
  b.name,
  b.image_url,
  b.description,
  b.element,
  b.weak_element,
  b.slug;

  create view
  public.team_nikke_details as
select
  tn.id as team_nikke_id,
  tn.team_id,
  tn.nikke_id,
  tn."position",
  n.name,
  n.slug,
  n.icon_url,
  n.full_image_url,
  n.rarity,
  n.element,
  n.weapon_type,
  n.burst,
  n.manufacturer
from
  team_nikkes tn
  join nikkes n on tn.nikke_id = n.id;


  create view
  public.teams_with_chapter_votes as
select
  t.id as team_id,
  t.user_id,
  t.mode_id,
  t.comment,
  t.game_version_id,
  t.created_at,
  coalesce(sum(v.vote), 0::bigint) as total_votes,
  ct.chapter_id,
  c.chapter_number,
  c.difficulty,
  c.title,
  p.username,
  p.avatar_url
from
  teams t
  left join votes v on t.id = v.team_id
  left join chapter_teams ct on t.id = ct.team_id
  left join chapters c on ct.chapter_id = c.id
  left join profiles p on t.user_id = p.id
group by
  t.id,
  ct.chapter_id,
  c.chapter_number,
  c.difficulty,
  c.title,
  p.username,
  p.avatar_url;

  create view
  public.teams_with_votes as
select
  t.id as team_id,
  t.user_id,
  t.mode_id,
  t.comment,
  t.game_version_id,
  t.created_at,
  coalesce(sum(v.vote), 0::bigint) as total_votes
from
  teams t
  left join votes v on t.id = v.team_id
group by
  t.id;


  create view
  public.tribe_tower_teams_detailed as
select
  ttt.id as team_id,
  ttt.user_id,
  ttt.tower_id,
  ttt.floor,
  ttt.comment,
  ttt.game_version_id,
  ttt.created_at,
  tt.name as tower_name,
  tt.manufacturer as tower_manufacturer,
  coalesce(sum(v.vote), 0::bigint) as total_votes,
  p.username,
  p.avatar_url,
  g.version as game_version
from
  tribe_tower_teams ttt
  join tribe_towers tt on ttt.tower_id = tt.id
  left join votes v on ttt.id = v.team_id
  left join profiles p on ttt.user_id = p.id
  left join game_versions g on ttt.game_version_id = g.id
group by
  ttt.id,
  tt.name,
  tt.manufacturer,
  p.username,
  p.avatar_url,
  g.version;


  create view
  public.tribe_tower_teams_with_votes as
select
  t.id as team_id,
  t.user_id,
  t.tower_id,
  t.floor,
  t.comment,
  t.game_version_id,
  t.created_at,
  tt.name as tower_name,
  tt.manufacturer as tower_manufacturer,
  coalesce(sum(v.vote), 0::bigint) as total_votes,
  p.username,
  p.avatar_url
from
  tribe_tower_teams t
  join tribe_towers tt on t.tower_id = tt.id
  left join votes v on t.id = v.team_id
  left join profiles p on t.user_id = p.id
group by
  t.id,
  tt.name,
  tt.manufacturer,
  p.username,
  p.avatar_url;


  CREATE VIEW public.tribe_tower_team_nikke_details AS
SELECT
  tttn.id AS team_nikke_id,
  tttn.team_id,
  tttn.nikke_id,
  tttn.position,
  n.name,
  n.slug,
  n.icon_url,
  n.full_image_url,
  n.rarity,
  n.element,
  n.weapon_type,
  n.burst,
  n.manufacturer
FROM
  tribe_tower_team_nikkes tttn
  JOIN nikkes n ON tttn.nikke_id = n.id;