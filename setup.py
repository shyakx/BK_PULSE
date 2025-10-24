"""
Setup script for BK Pulse package.
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="bk-pulse",
    version="1.0.0",
    author="ALU Rwanda Mission Capstone Team",
    description="Customer churn prediction system for Bank of Kigali",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/shyakx/BK_PULSE",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Financial and Insurance Industry",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    entry_points={
        "console_scripts": [
            "bk-pulse-train=train:main",
            "bk-pulse-predict=predict:main",
        ],
    },
)
