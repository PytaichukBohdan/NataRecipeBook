#!/bin/bash
# Batch video generator - runs videos in groups of 3 parallel
# Usage: ./batch_generate.sh

PROJECT="/home/openclaw/projects/NataRecipeBook"
SKILL="$PROJECT/.claude/skills/piapi-video-generator"
OUTPUT="$PROJECT/public/recipe_images/videos"
IMAGES="$PROJECT/public/recipe_images"
LOG_DIR="/tmp/video_gen_logs"

mkdir -p "$LOG_DIR"

PROMPT_TEMPLATE='A high-angle, cinematic studio shot of a RECIPE_NAME in a ceramic bowl, centered on a clean white background, transforming into an exploded-view visualization where individual ingredients gently separate and float upward in a vertical stack. Smooth, dreamlike motion with soft studio lighting. Professional food photography style with subtle depth of field.'

generate_one() {
  local recipe="$1"
  local name="$2"
  local tmpdir="/tmp/vgen_${recipe}"
  local logfile="$LOG_DIR/${recipe}.log"
  
  mkdir -p "$tmpdir"
  
  local prompt="${PROMPT_TEMPLATE//RECIPE_NAME/$name}"
  
  echo "[$(date +%H:%M:%S)] START: $recipe" | tee -a "$logfile"
  
  cd "$SKILL" && uv run python generate_video.py \
    --start-image "$IMAGES/${recipe}.jpeg" \
    --end-image "$IMAGES/overhead/${recipe}.jpeg" \
    --prompt "$prompt" \
    --duration 5 --output "$tmpdir" >> "$logfile" 2>&1
  
  if [ $? -eq 0 ]; then
    mv -f "$tmpdir"/piapi_*.mp4 "$OUTPUT/${recipe}.mp4" 2>/dev/null || \
    mv -f "$tmpdir"/*.mp4 "$OUTPUT/${recipe}.mp4" 2>/dev/null
    echo "[$(date +%H:%M:%S)] DONE: $recipe" | tee -a "$logfile"
    echo "$recipe" >> "$LOG_DIR/completed.txt"
  else
    echo "[$(date +%H:%M:%S)] FAIL: $recipe" | tee -a "$logfile"
    echo "$recipe" >> "$LOG_DIR/failed.txt"
  fi
  
  rm -rf "$tmpdir"
}

run_batch() {
  local pids=()
  for recipe_entry in "$@"; do
    local recipe="${recipe_entry%%|*}"
    local name="${recipe_entry##*|}"
    generate_one "$recipe" "$name" &
    pids+=($!)
  done
  
  for pid in "${pids[@]}"; do
    wait $pid
  done
}

# Clear state
> "$LOG_DIR/completed.txt"
> "$LOG_DIR/failed.txt"

echo "=== PHASE 1: Re-generating 25 wrong-direction videos ==="
echo "=== Batch 1/9 ==="
run_batch \
  "breakfast_1|healthy breakfast bowl" \
  "breakfast_2|nutritious breakfast plate" \
  "breakfast_3|delicious breakfast meal"

echo "=== Batch 2/9 ==="
run_batch \
  "breakfast_4|energizing breakfast bowl" \
  "breakfast_5|wholesome breakfast plate" \
  "breakfast_11|protein breakfast bowl"

echo "=== Batch 3/9 ==="
run_batch \
  "breakfast_12|balanced breakfast plate" \
  "breakfast_13|morning energy breakfast" \
  "breakfast_14|colorful breakfast bowl"

echo "=== Batch 4/9 ==="
run_batch \
  "desserts_1|healthy dessert" \
  "desserts_2|sweet protein dessert" \
  "desserts_3|fruity dessert bowl"

echo "=== Batch 5/9 ==="
run_batch \
  "desserts_11|delicate dessert" \
  "desserts_12|light dessert plate" \
  "desserts_13|protein dessert bowl"

echo "=== Batch 6/9 ==="
run_batch \
  "desserts_14|healthy sweet treat" \
  "desserts_15|berry dessert bowl" \
  "lunch_dinner_1|balanced lunch plate"

echo "=== Batch 7/9 ==="
run_batch \
  "lunch_dinner_2|nutritious dinner plate" \
  "lunch_dinner_3|protein lunch bowl" \
  "lunch_dinner_4|healthy dinner meal"

echo "=== Batch 8/9 ==="
run_batch \
  "lunch_dinner_14|wholesome dinner plate" \
  "lunch_dinner_15|light lunch plate" \
  "lunch_dinner_16|balanced dinner bowl"

echo "=== Batch 9/9 ==="
run_batch \
  "lunch_dinner_17|healthy supper plate"

echo ""
echo "=== PHASE 1 COMPLETE ==="
echo "Completed: $(wc -l < "$LOG_DIR/completed.txt") / 25"
echo "Failed: $(wc -l < "$LOG_DIR/failed.txt")"

echo ""
echo "=== PHASE 2: Generating 33 missing videos ==="

echo "=== Missing Batch 1/11 ==="
run_batch \
  "breakfast_6|Збалансований сніданок" \
  "breakfast_7|Зелений баланс" \
  "breakfast_8|Омлет з Мунг"

echo "=== Missing Batch 2/11 ==="
run_batch \
  "breakfast_9|Білкові млинці з полуницею" \
  "breakfast_10|Твій ідеальний сніданок" \
  "breakfast_16|Вишневий вівсяномлинець"

echo "=== Missing Batch 3/11 ==="
run_batch \
  "breakfast_17|Барвисті тости" \
  "breakfast_18|Протеінова вівсянка" \
  "breakfast_19|delicious breakfast plate"

echo "=== Missing Batch 4/11 ==="
run_batch \
  "breakfast_20|Зелена каша з омлетом" \
  "desserts_5|Шоколадний десерт без випікання" \
  "desserts_6|Морозильний фруктовий десерт"

echo "=== Missing Batch 5/11 ==="
run_batch \
  "desserts_7|Швидкий білковий десерт" \
  "desserts_8|Млинці з фруктово-сирною начинкою" \
  "desserts_9|Кавуновий сендвіч"

echo "=== Missing Batch 6/11 ==="
run_batch \
  "desserts_10|Протеїнова запіканка з вишнею" \
  "desserts_16|Хрусткі шоколадні хлібці з протеїновим пудингом" \
  "desserts_17|Фруктова гранолка"

echo "=== Missing Batch 7/11 ==="
run_batch \
  "desserts_18|Вафлі з вишнею" \
  "desserts_19|Сирнички" \
  "desserts_20|Кекси з ягодами"

echo "=== Missing Batch 8/11 ==="
run_batch \
  "lunch_dinner_6|Просто та зі смаком" \
  "lunch_dinner_7|Твій найкращий ПП хачапурі" \
  "lunch_dinner_8|Зелена тарілка"

echo "=== Missing Batch 9/11 ==="
run_batch \
  "lunch_dinner_9|Снековий баланс" \
  "lunch_dinner_10|ПП Лазанья" \
  "lunch_dinner_13|Тортильї які ти полюбиш одразу"

echo "=== Missing Batch 10/11 ==="
run_batch \
  "lunch_dinner_20|Зелена паста" \
  "lunch_dinner_21|Паста з трюфелем та стейком тунця" \
  "lunch_dinner_22|Збалансований баланс"

echo "=== Missing Batch 11/11 ==="
run_batch \
  "lunch_dinner_23|Вечеря з білковим смаколиком" \
  "lunch_dinner_24|Медальйони з тунця салатний мікс та картопля" \
  "lunch_dinner_25|Булгур з овочами та курочкою"

echo ""
echo "=== ALL DONE ==="
echo "Total completed: $(wc -l < "$LOG_DIR/completed.txt") / 58"
echo "Total failed: $(wc -l < "$LOG_DIR/failed.txt")"
cat "$LOG_DIR/failed.txt" 2>/dev/null
