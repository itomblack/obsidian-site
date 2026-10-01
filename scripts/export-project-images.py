"""Export responsive project photos from the originals (macOS sips required)."""

from pathlib import Path
import subprocess


PHOTOS = Path(__file__).resolve().parents[1] / "src/assets/photos"
SOURCES = {
    "maven": "Maven - 07.jpg",
    "counter": "Counter - 18.jpg",
    "ledger": "Ledger - 10.jpg",
    "lululemon": "Lululemon - 01.jpg",
    "maven-bmi": "Maven - BMI Results — Glass shelf.jpg",
    "maven-forecast": "Maven - Weight Forecast — Cream sofa.jpg",
    "maven-inbox": "Maven - Check Your Inbox — Dark wall.jpg",
    "maven-order": "Maven - Order Confirmation — Daylight wood desk.jpg",
    "maven-dashboard": "Maven - Home Dashboard A — Olive chair.jpg",
    **{f"counter-sequence-{i:02}": f"Counter - {i:02}.jpg" for i in range(1, 5)},
}


def export_images():
    output = PHOTOS / "optimized"
    output.mkdir(exist_ok=True)
    for name, filename in SOURCES.items():
        source = PHOTOS / filename
        dimensions = subprocess.run(
            ["sips", "-g", "pixelWidth", str(source)],
            capture_output=True, text=True, check=True,
        ).stdout
        source_width = int(dimensions.split("pixelWidth:")[1].strip())
        # Keep source detail without manufacturing pixels by upscaling.
        maximum = min(source_width, 2880)
        widths = {640, 1440, min(2200, maximum), maximum}
        if name in {"maven", "counter", "ledger", "lululemon"}:
            widths.add(960)
        widths = sorted(widths)
        for width in widths:
            target = output / f"{name}-{width}.jpg"
            subprocess.run(
                ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "92",
                 "--resampleWidth", str(width), str(source), "--out", str(target)],
                capture_output=True, check=True,
            )
        print(f"{name}: {', '.join(map(str, widths))}px")


if __name__ == "__main__":
    export_images()
