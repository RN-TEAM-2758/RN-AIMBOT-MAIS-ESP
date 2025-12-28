repeat task.wait() until game:IsLoaded()
wait(1)

-- Services
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Camera = workspace.CurrentCamera
local HttpService = game:GetService("HttpService")
local TextService = game:GetService("TextService")

-- UI Setup
local guiReady, PlayerGui = pcall(function()
    return LocalPlayer:WaitForChild("PlayerGui", 5)
end)

if not guiReady or not PlayerGui then
    warn("PlayerGui not loaded.")
    return
end

-- Destroy existing UI if it exists
if PlayerGui:FindFirstChild("MODMENU_V3") then
    PlayerGui:FindFirstChild("MODMENU_V3"):Destroy()
end

-- Main UI Container
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "MODMENU_V3"
ScreenGui.ResetOnSpawn = false
ScreenGui.IgnoreGuiInset = true
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
ScreenGui.Parent = PlayerGui

-- UI Theme (NOVO VISUAL - DARK NEON)
local Theme = {
    Background = Color3.fromRGB(15, 15, 25),
    Secondary = Color3.fromRGB(25, 25, 35),
    Button = Color3.fromRGB(35, 35, 45),
    ButtonHover = Color3.fromRGB(45, 45, 55),
    Accent = Color3.fromRGB(0, 200, 255),
    Accent2 = Color3.fromRGB(255, 100, 0),
    Text = Color3.new(1, 1, 1),
    SubText = Color3.fromRGB(180, 180, 180),
    TabActive = Color3.fromRGB(0, 150, 255),
    TabInactive = Color3.fromRGB(40, 40, 60),
    TabHover = Color3.fromRGB(60, 60, 80),
    Success = Color3.fromRGB(0, 255, 100),
    Warning = Color3.fromRGB(255, 200, 0),
    Danger = Color3.fromRGB(255, 50, 50),
    SliderTrack = Color3.fromRGB(50, 50, 70),
    SliderFill = Color3.fromRGB(0, 150, 255)
}

-- Floating Toggle Button
local FloatButton = Instance.new("TextButton")
FloatButton.Name = "ToggleButton"
FloatButton.Size = UDim2.new(0, 70, 0, 70)
FloatButton.Position = UDim2.new(0, 20, 0.8, -35)
FloatButton.Text = "≡"
FloatButton.TextSize = 32
FloatButton.BackgroundColor3 = Theme.Accent
FloatButton.TextColor3 = Theme.Text
FloatButton.Font = Enum.Font.GothamBold
FloatButton.BorderSizePixel = 0
FloatButton.ZIndex = 100
FloatButton.AutoButtonColor = false
FloatButton.Parent = ScreenGui

-- Estilização do botão flutuante
local buttonCorner = Instance.new("UICorner", FloatButton)
buttonCorner.CornerRadius = UDim.new(0.3, 0)

local buttonShadow = Instance.new("ImageLabel", FloatButton)
buttonShadow.Image = "rbxassetid://1316045217"
buttonShadow.ImageColor3 = Color3.new(0, 0, 0)
buttonShadow.ImageTransparency = 0.8
buttonShadow.ScaleType = Enum.ScaleType.Slice
buttonShadow.SliceCenter = Rect.new(10, 10, 118, 118)
buttonShadow.Size = UDim2.new(1, 20, 1, 20)
buttonShadow.Position = UDim2.new(-0.1, -10, -0.1, -10)
buttonShadow.BackgroundTransparency = 1
buttonShadow.ZIndex = 99

-- Efeito de brilho
local buttonGlow = Instance.new("Frame", FloatButton)
buttonGlow.Size = UDim2.new(1, 0, 1, 0)
buttonGlow.BackgroundColor3 = Theme.Accent
buttonGlow.BackgroundTransparency = 0.8
buttonGlow.ZIndex = -1
Instance.new("UICorner", buttonGlow).CornerRadius = UDim.new(0.3, 0)

-- Main Panel
local MainPanel = Instance.new("Frame")
MainPanel.Name = "MainPanel"
MainPanel.Size = UDim2.new(0.9, 0, 0.8, 0)
MainPanel.Position = UDim2.new(0.5, 0, 0.5, 0)
MainPanel.AnchorPoint = Vector2.new(0.5, 0.5)
MainPanel.BackgroundColor3 = Theme.Background
MainPanel.Visible = false
MainPanel.Parent = ScreenGui

-- Bordas arredondadas
local panelCorner = Instance.new("UICorner", MainPanel)
panelCorner.CornerRadius = UDim.new(0.08, 0)

-- Sombra do painel
local panelShadow = Instance.new("ImageLabel", MainPanel)
panelShadow.Image = "rbxassetid://1316045217"
panelShadow.ImageColor3 = Color3.new(0, 0, 0)
panelShadow.ImageTransparency = 0.7
panelShadow.ScaleType = Enum.ScaleType.Slice
panelShadow.SliceCenter = Rect.new(10, 10, 118, 118)
panelShadow.Size = UDim2.new(1, 20, 1, 20)
panelShadow.Position = UDim2.new(-0.04, -10, -0.04, -10)
panelShadow.BackgroundTransparency = 1
panelShadow.ZIndex = -1

-- Header do painel
local header = Instance.new("Frame")
header.Name = "Header"
header.Size = UDim2.new(1, 0, 0, 50)
header.BackgroundColor3 = Theme.Accent
header.BorderSizePixel = 0
header.Parent = MainPanel

local headerCorner = Instance.new("UICorner", header)
headerCorner.CornerRadius = UDim.new(0.08, 0, 0, 0)

local title = Instance.new("TextLabel")
title.Name = "Title"
title.Size = UDim2.new(0.7, 0, 1, 0)
title.Position = UDim2.new(0.15, 0, 0, 0)
title.Text = "RN TEAM"
title.TextSize = 22
title.TextColor3 = Theme.Text
title.Font = Enum.Font.GothamBold
title.BackgroundTransparency = 1
title.Parent = header

local closeBtn = Instance.new("TextButton")
closeBtn.Name = "CloseButton"
closeBtn.Size = UDim2.new(0, 40, 0, 40)
closeBtn.Position = UDim2.new(1, -45, 0.5, -20)
closeBtn.Text = "✕"
closeBtn.TextSize = 24
closeBtn.TextColor3 = Theme.Text
closeBtn.BackgroundColor3 = Theme.Danger
closeBtn.Font = Enum.Font.GothamBold
closeBtn.AutoButtonColor = false
closeBtn.Parent = header

local closeCorner = Instance.new("UICorner", closeBtn)
closeCorner.CornerRadius = UDim.new(0.5, 0)

-- Container de tabs
local tabContainer = Instance.new("Frame")
tabContainer.Name = "TabContainer"
tabContainer.Size = UDim2.new(1, 0, 1, -50)
tabContainer.Position = UDim2.new(0, 0, 0, 50)
tabContainer.BackgroundTransparency = 1
tabContainer.Parent = MainPanel

-- Tab buttons (lado esquerdo)
local tabButtons = Instance.new("Frame")
tabButtons.Name = "TabButtons"
tabButtons.Size = UDim2.new(0.2, 0, 1, 0)
tabButtons.BackgroundTransparency = 1
tabButtons.Parent = tabContainer

local tabListLayout = Instance.new("UIListLayout", tabButtons)
tabListLayout.Padding = UDim.new(0, 5)
tabListLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center

-- Tab content (lado direito)
local tabContent = Instance.new("Frame")
tabContent.Name = "TabContent"
tabContent.Size = UDim2.new(0.8, 0, 1, 0)
tabContent.Position = UDim2.new(0.2, 0, 0, 0)
tabContent.BackgroundTransparency = 1
tabContent.Parent = tabContainer

-- Scrollable content
local contentScroller = Instance.new("ScrollingFrame")
contentScroller.Name = "ContentScroller"
contentScroller.Size = UDim2.new(1, -20, 1, -20)
contentScroller.Position = UDim2.new(0, 10, 0, 10)
contentScroller.BackgroundTransparency = 1
contentScroller.ScrollBarThickness = 4
contentScroller.ScrollBarImageColor3 = Theme.Accent
contentScroller.Parent = tabContent

local contentList = Instance.new("UIListLayout", contentScroller)
contentList.Padding = UDim.new(0, 10)

-- Sistema de tabs
local Tabs = {}
local CurrentTab = nil

local function CreateTab(tabName, icon)
    local tabButton = Instance.new("TextButton")
    tabButton.Name = tabName.."Tab"
    tabButton.Size = UDim2.new(0.9, 0, 0, 50)
    tabButton.Text = icon.."\n"..tabName
    tabButton.TextSize = 12
    tabButton.TextColor3 = Theme.SubText
    tabButton.Font = Enum.Font.Gotham
    tabButton.AutoButtonColor = false
    tabButton.BackgroundColor3 = Theme.TabInactive
    tabButton.Parent = tabButtons
    
    local tabCorner = Instance.new("UICorner", tabButton)
    tabCorner.CornerRadius = UDim.new(0.1, 0)
    
    local tabContentFrame = Instance.new("Frame")
    tabContentFrame.Name = tabName.."Content"
    tabContentFrame.Size = UDim2.new(1, 0, 0, 0)
    tabContentFrame.BackgroundTransparency = 1
    tabContentFrame.Visible = false
    tabContentFrame.Parent = contentScroller
    
    Tabs[tabName] = {
        Button = tabButton,
        Content = tabContentFrame
    }
    
    tabButton.MouseButton1Click:Connect(function()
        for name, tab in pairs(Tabs) do
            tab.Content.Visible = (name == tabName)
            tab.Button.BackgroundColor3 = (name == tabName) and Theme.TabActive or Theme.TabInactive
            tab.Button.TextColor3 = (name == tabName) and Theme.Text or Theme.SubText
        end
        CurrentTab = tabName
        
        -- Update scroll size
        task.wait()
        if Tabs[tabName].Content:FindFirstChildOfClass("UIListLayout") then
            local layout = Tabs[tabName].Content:FindFirstChildOfClass("UIListLayout")
            contentScroller.CanvasSize = UDim2.new(0, 0, 0, layout.AbsoluteContentSize.Y + 20)
        end
    end)
    
    local contentLayout = Instance.new("UIListLayout", tabContentFrame)
    contentLayout.Padding = UDim.new(0, 8)
    
    if not CurrentTab then
        CurrentTab = tabName
        tabButton.BackgroundColor3 = Theme.TabActive
        tabButton.TextColor3 = Theme.Text
        tabContentFrame.Visible = true
    end
    
    return tabContentFrame
end

-- Funções auxiliares
local function CreateToggle(parent, text, default, callback)
    local toggleFrame = Instance.new("Frame")
    toggleFrame.Size = UDim2.new(1, 0, 0, 35)
    toggleFrame.BackgroundTransparency = 1
    toggleFrame.Parent = parent
    
    local label = Instance.new("TextLabel")
    label.Size = UDim2.new(0.7, 0, 1, 0)
    label.Position = UDim2.new(0, 0, 0, 0)
    label.Text = "  "..text
    label.TextSize = 14
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.BackgroundTransparency = 1
    label.TextColor3 = Theme.Text
    label.Font = Enum.Font.Gotham
    label.Parent = toggleFrame
    
    local toggleButton = Instance.new("TextButton")
    toggleButton.Size = UDim2.new(0, 60, 0, 30)
    toggleButton.Position = UDim2.new(1, -60, 0.5, -15)
    toggleButton.Text = default and "ON" or "OFF"
    toggleButton.TextSize = 12
    toggleButton.TextColor3 = Theme.Text
    toggleButton.BackgroundColor3 = default and Theme.Success or Theme.Button
    toggleButton.AutoButtonColor = false
    toggleButton.Font = Enum.Font.GothamBold
    toggleButton.Parent = toggleFrame
    
    local toggleCorner = Instance.new("UICorner", toggleButton)
    toggleCorner.CornerRadius = UDim.new(0.5, 0)
    
    toggleButton.MouseButton1Click:Connect(function()
        local newState = not (toggleButton.Text == "ON")
        toggleButton.Text = newState and "ON" or "OFF"
        toggleButton.BackgroundColor3 = newState and Theme.Success or Theme.Button
        callback(newState)
    end)
    
    return {
        SetState = function(state)
            toggleButton.Text = state and "ON" or "OFF"
            toggleButton.BackgroundColor3 = state and Theme.Success or Theme.Button
        end,
        GetState = function()
            return toggleButton.Text == "ON"
        end
    }
end

local function CreateSlider(parent, text, min, max, default, callback, valueDisplay)
    local sliderFrame = Instance.new("Frame")
    sliderFrame.Size = UDim2.new(1, 0, 0, 60)
    sliderFrame.BackgroundTransparency = 1
    sliderFrame.Parent = parent
    
    local label = Instance.new("TextLabel")
    label.Size = UDim2.new(1, 0, 0, 20)
    label.Text = text
    label.TextSize = 14
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.BackgroundTransparency = 1
    label.TextColor3 = Theme.Text
    label.Font = Enum.Font.Gotham
    label.Parent = sliderFrame
    
    local valueText = Instance.new("TextLabel")
    valueText.Size = UDim2.new(0, 60, 0, 20)
    valueText.Position = UDim2.new(1, -60, 0, 0)
    valueText.Text = tostring(default)
    valueText.TextSize = 14
    valueText.TextXAlignment = Enum.TextXAlignment.Right
    valueText.BackgroundTransparency = 1
    valueText.TextColor3 = Theme.SubText
    valueText.Font = Enum.Font.Gotham
    valueText.Parent = sliderFrame
    
    local track = Instance.new("Frame")
    track.Size = UDim2.new(1, 0, 0, 8)
    track.Position = UDim2.new(0, 0, 0, 30)
    track.BackgroundColor3 = Theme.SliderTrack
    track.BorderSizePixel = 0
    track.Parent = sliderFrame
    
    local trackCorner = Instance.new("UICorner", track)
    trackCorner.CornerRadius = UDim.new(0.5, 0)
    
    local fill = Instance.new("Frame")
    fill.Size = UDim2.new((default - min) / (max - min), 0, 1, 0)
    fill.BackgroundColor3 = Theme.SliderFill
    fill.BorderSizePixel = 0
    fill.Parent = track
    
    local fillCorner = Instance.new("UICorner", fill)
    fillCorner.CornerRadius = UDim.new(0.5, 0)
    
    local thumb = Instance.new("Frame")
    thumb.Size = UDim2.new(0, 20, 0, 20)
    thumb.Position = UDim2.new((default - min) / (max - min), -10, 0.5, -10)
    thumb.BackgroundColor3 = Theme.Accent
    thumb.BorderSizePixel = 0
    thumb.ZIndex = 2
    thumb.Parent = track
    
    local thumbCorner = Instance.new("UICorner", thumb)
    thumbCorner.CornerRadius = UDim.new(0.5, 0)
    
    local dragging = false
    
    local function updateValue(input)
        local x = (input.Position.X - track.AbsolutePosition.X) / track.AbsoluteSize.X
        x = math.clamp(x, 0, 1)
        local value = min + (max - min) * x
        
        fill.Size = UDim2.new(x, 0, 1, 0)
        thumb.Position = UDim2.new(x, -10, 0.5, -10)
        
        if valueDisplay then
            valueText.Text = valueDisplay(value)
        else
            valueText.Text = string.format("%.1f", value)
        end
        
        callback(value)
    end
    
    track.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = true
            updateValue(input)
        end
    end)
    
    UserInputService.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = false
        end
    end)
    
    UserInputService.InputChanged:Connect(function(input)
        if dragging and (input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseMovement) then
            updateValue(input)
        end
    end)
    
    return {
        SetValue = function(value)
            local x = (value - min) / (max - min)
            x = math.clamp(x, 0, 1)
            fill.Size = UDim2.new(x, 0, 1, 0)
            thumb.Position = UDim2.new(x, -10, 0.5, -10)
            if valueDisplay then
                valueText.Text = valueDisplay(value)
            else
                valueText.Text = string.format("%.1f", value)
            end
            callback(value)
        end
    }
end

local function CreateButton(parent, text, callback)
    local button = Instance.new("TextButton")
    button.Size = UDim2.new(1, 0, 0, 40)
    button.Text = text
    button.TextSize = 14
    button.TextColor3 = Theme.Text
    button.BackgroundColor3 = Theme.Button
    button.AutoButtonColor = false
    button.Font = Enum.Font.Gotham
    button.Parent = parent
    
    local buttonCorner = Instance.new("UICorner", button)
    buttonCorner.CornerRadius = UDim.new(0.1, 0)
    
    button.MouseEnter:Connect(function()
        if button.BackgroundColor3 ~= Theme.Accent then
            TweenService:Create(button, TweenInfo.new(0.2), {BackgroundColor3 = Theme.ButtonHover}):Play()
        end
    end)
    
    button.MouseLeave:Connect(function()
        if button.BackgroundColor3 ~= Theme.Accent then
            TweenService:Create(button, TweenInfo.new(0.2), {BackgroundColor3 = Theme.Button}):Play()
        end
    end)
    
    button.MouseButton1Click:Connect(function()
        TweenService:Create(button, TweenInfo.new(0.1), {BackgroundColor3 = Theme.Accent}):Play()
        wait(0.1)
        TweenService:Create(button, TweenInfo.new(0.1), {BackgroundColor3 = Theme.Button}):Play()
        callback()
    end)
    
    return button
end

-- Toggle UI
local minimized = true
FloatButton.MouseButton1Click:Connect(function()
    minimized = not minimized
    MainPanel.Visible = not minimized
    
    if minimized then
        FloatButton.Text = "≡"
        TweenService:Create(FloatButton, TweenInfo.new(0.3), {Rotation = 0}):Play()
    else
        FloatButton.Text = "✕"
        TweenService:Create(FloatButton, TweenInfo.new(0.3), {Rotation = 180}):Play()
    end
end)

closeBtn.MouseButton1Click:Connect(function()
    minimized = true
    MainPanel.Visible = false
    FloatButton.Text = "≡"
    TweenService:Create(FloatButton, TweenInfo.new(0.3), {Rotation = 0}):Play()
end)

-- Criar tabs
local espTab = CreateTab("ESP", "👁️")
local chamsTab = CreateTab("CHAMS", "🎨")
local aimbotTab = CreateTab("AIMBOT", "🎯")
local playerTab = CreateTab("PLAYER", "👤")
local utilsTab = CreateTab("UTILS", "⚙️")
local espColorsTab = CreateTab("ESP COLORS", "🎨")

-- ==================== SISTEMA DE TIME ====================
-- Função para verificar se um jogador é inimigo
local function IsEnemy(player)
    if player == LocalPlayer then return false end
    -- Se o jogo não tem times, considera todos como inimigos
    if not LocalPlayer.Team or not player.Team then return true end
    -- Retorna true se for de time diferente
    return player.Team ~= LocalPlayer.Team
end

-- ==================== VARIÁVEIS GLOBAIS ====================
_G.ESP_Dist_Ativo = false
_G.ESP_Linha_Ativo = false
_G.ESP_Skeleton_Ativo = false
_G.ESP_Vida_Ativo = false
_G.ESP_Name_Ativo = false
_G.Aimbot_Ativo = false

local textos = {}
local linhas = {}
local skeletonLines = {}
local nameTags = {}
local healthBars = {}
local chamsHighlights = {}

-- Variáveis para armazenar as cores (só para ESP de distância)
local espDistColor = Color3.fromRGB(255, 0, 0) -- Vermelho padrão só para distância
local espDistTransparency = 1 -- Opacidade máxima padrão

-- Função para atualizar apenas as cores do ESP de distância
local function updateESPDistColors()
    if _G.ESP_Dist_Ativo then
        for _, jogador in pairs(game:GetService("Players"):GetPlayers()) do
            if jogador ~= LocalPlayer and textos[jogador] then
                textos[jogador].texto.Color = espDistColor
            end
        end
    end
end

-- Configuração da aba de cores do ESP (apenas para distância)
do
    -- Contêiner para as configurações de cor
    local colorContainer = Instance.new("Frame")
    colorContainer.Name = "ColorContainer"
    colorContainer.Size = UDim2.new(1, -20, 0, 200)
    colorContainer.Position = UDim2.new(0, 10, 0, 10)
    colorContainer.BackgroundTransparency = 1
    colorContainer.Parent = espColorsTab

    -- Seletor de cor
    local colorPickerLabel = Instance.new("TextLabel")
    colorPickerLabel.Name = "ColorPickerLabel"
    colorPickerLabel.Size = UDim2.new(1, 0, 0, 20)
    colorPickerLabel.Position = UDim2.new(0, 0, 0, 0)
    colorPickerLabel.Text = "Cor do ESP (Distância):"
    colorPickerLabel.TextSize = 14
    colorPickerLabel.TextXAlignment = Enum.TextXAlignment.Left
    colorPickerLabel.BackgroundTransparency = 1
    colorPickerLabel.TextColor3 = Theme.Text
    colorPickerLabel.Font = Enum.Font.Gotham
    colorPickerLabel.Parent = colorContainer

    local colorPreview = Instance.new("Frame")
    colorPreview.Name = "ColorPreview"
    colorPreview.Size = UDim2.new(0, 50, 0, 30)
    colorPreview.Position = UDim2.new(1, -50, 0, 0)
    colorPreview.BackgroundColor3 = espDistColor
    colorPreview.Parent = colorPickerLabel

    local colorCorner = Instance.new("UICorner", colorPreview)
    colorCorner.CornerRadius = UDim.new(0, 6)

    local colorPickerButton = Instance.new("TextButton")
    colorPickerButton.Name = "ColorPickerButton"
    colorPickerButton.Size = UDim2.new(0.7, 0, 0, 30)
    colorPickerButton.Position = UDim2.new(0, 0, 0, 25)
    colorPickerButton.Text = "Selecionar Cor"
    colorPickerButton.TextSize = 14
    colorPickerButton.BackgroundColor3 = Theme.Button
    colorPickerButton.TextColor3 = Theme.Text
    colorPickerButton.Font = Enum.Font.Gotham
    colorPickerButton.AutoButtonColor = true
    colorPickerButton.Parent = colorContainer

    local buttonCorner = Instance.new("UICorner", colorPickerButton)
    buttonCorner.CornerRadius = UDim.new(0, 6)

    colorPickerButton.MouseButton1Click:Connect(function()
        local colorPicker = Instance.new("Frame")
        colorPicker.Name = "ColorPicker"
        colorPicker.Size = UDim2.new(0, 200, 0, 200)
        colorPicker.Position = UDim2.new(0.5, -100, 0.5, -100)
        colorPicker.BackgroundColor3 = Theme.Background
        colorPicker.Parent = ScreenGui
        
        local pickerCorner = Instance.new("UICorner", colorPicker)
        pickerCorner.CornerRadius = UDim.new(0, 12)
        
        local pickerShadow = Instance.new("ImageLabel", colorPicker)
        pickerShadow.Name = "Shadow"
        pickerShadow.Image = "rbxassetid://1316045217"
        pickerShadow.ImageColor3 = Color3.new(0, 0, 0)
        pickerShadow.ImageTransparency = 0.8
        pickerShadow.ScaleType = Enum.ScaleType.Slice
        pickerShadow.SliceCenter = Rect.new(10, 10, 118, 118)
        pickerShadow.Size = UDim2.new(1, 10, 1, 10)
        pickerShadow.Position = UDim2.new(0, -5, 0, -5)
        pickerShadow.BackgroundTransparency = 1
        pickerShadow.ZIndex = -1
        
        local huePicker = Instance.new("ImageLabel")
        huePicker.Name = "HuePicker"
        huePicker.Size = UDim2.new(0, 30, 0, 150)
        huePicker.Position = UDim2.new(0, 10, 0, 10)
        huePicker.Image = "rbxassetid://2615689005"
        huePicker.BackgroundTransparency = 1
        huePicker.Parent = colorPicker
        
        local saturationPicker = Instance.new("ImageLabel")
        saturationPicker.Name = "SaturationPicker"
        saturationPicker.Size = UDim2.new(0, 150, 0, 150)
        saturationPicker.Position = UDim2.new(0, 50, 0, 10)
        saturationPicker.BackgroundColor3 = Color3.fromHSV(0, 1, 1)
        saturationPicker.Image = "rbxassetid://2615689232"
        saturationPicker.Parent = colorPicker
        
        local hueSelector = Instance.new("Frame")
        hueSelector.Name = "HueSelector"
        hueSelector.Size = UDim2.new(1, 0, 0, 5)
        hueSelector.BackgroundColor3 = Color3.new(1, 1, 1)
        hueSelector.BorderSizePixel = 2
        hueSelector.Parent = huePicker
        
        local saturationSelector = Instance.new("Frame")
        saturationSelector.Name = "SaturationSelector"
        saturationSelector.Size = UDim2.new(0, 5, 0, 5)
        saturationSelector.BackgroundColor3 = Color3.new(1, 1, 1)
        saturationSelector.BorderSizePixel = 2
        saturationSelector.Parent = saturationPicker
        
        local closeButton = Instance.new("TextButton")
        closeButton.Name = "CloseButton"
        closeButton.Size = UDim2.new(0, 180, 0, 30)
        closeButton.Position = UDim2.new(0, 10, 0, 170)
        closeButton.Text = "Aplicar Cor"
        closeButton.TextSize = 14
        closeButton.BackgroundColor3 = Theme.Accent
        closeButton.TextColor3 = Theme.Text
        closeButton.Font = Enum.Font.GothamBold
        closeButton.Parent = colorPicker
        
        local closeCorner = Instance.new("UICorner", closeButton)
        closeCorner.CornerRadius = UDim.new(0, 6)
        
        local currentHue, currentSat, currentVal = Color3.toHSV(espDistColor)
        
        local function updateColor()
            espDistColor = Color3.fromHSV(currentHue, currentSat, currentVal)
            colorPreview.BackgroundColor3 = espDistColor
            saturationPicker.BackgroundColor3 = Color3.fromHSV(currentHue, 1, 1)
            updateESPDistColors()
        end
        
        huePicker.InputBegan:Connect(function(input)
            if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                local y = (input.Position.Y - huePicker.AbsolutePosition.Y) / huePicker.AbsoluteSize.Y
                currentHue = 1 - math.clamp(y, 0, 1)
                hueSelector.Position = UDim2.new(0, 0, y, -2)
                updateColor()
            end
        end)
        
        saturationPicker.InputBegan:Connect(function(input)
            if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                local x = (input.Position.X - saturationPicker.AbsolutePosition.X) / saturationPicker.AbsoluteSize.X
                local y = (input.Position.Y - saturationPicker.AbsolutePosition.Y) / saturationPicker.AbsoluteSize.Y
                currentSat = math.clamp(x, 0, 1)
                currentVal = 1 - math.clamp(y, 0, 1)
                saturationSelector.Position = UDim2.new(x, -2, y, -2)
                updateColor()
            end
        end)
        
        closeButton.MouseButton1Click:Connect(function()
            colorPicker:Destroy()
        end)
    end)

    -- Controle deslizante de transparência
    local transparencyLabel = Instance.new("TextLabel")
    transparencyLabel.Name = "TransparencyLabel"
    transparencyLabel.Size = UDim2.new(1, 0, 0, 20)
    transparencyLabel.Position = UDim2.new(0, 0, 0, 70)
    transparencyLabel.Text = "Intensidade da Cor:"
    transparencyLabel.TextSize = 14
    transparencyLabel.TextXAlignment = Enum.TextXAlignment.Left
    transparencyLabel.BackgroundTransparency = 1
    transparencyLabel.TextColor3 = Theme.Text
    transparencyLabel.Font = Enum.Font.Gotham
    transparencyLabel.Parent = colorContainer

    local sliderTrack = Instance.new("Frame")
    sliderTrack.Name = "SliderTrack"
    sliderTrack.Size = UDim2.new(1, 0, 0, 10)
    sliderTrack.Position = UDim2.new(0, 0, 0, 95)
    sliderTrack.BackgroundColor3 = Theme.TabInactive
    sliderTrack.Parent = colorContainer

    local trackCorner = Instance.new("UICorner", sliderTrack)
    trackCorner.CornerRadius = UDim.new(1, 0)

    local sliderFill = Instance.new("Frame")
    sliderFill.Name = "SliderFill"
    sliderFill.Size = UDim2.new(espDistTransparency, 0, 1, 0)
    sliderFill.Position = UDim2.new(0, 0, 0, 0)
    sliderFill.BackgroundColor3 = Theme.Accent
    sliderFill.Parent = sliderTrack

    local fillCorner = Instance.new("UICorner", sliderFill)
    fillCorner.CornerRadius = UDim.new(1, 0)

    local sliderThumb = Instance.new("Frame")
    sliderThumb.Name = "SliderThumb"
    sliderThumb.Size = UDim2.new(0, 20, 0, 20)
    sliderThumb.Position = UDim2.new(espDistTransparency, -10, 0.5, -10)
    sliderThumb.BackgroundColor3 = Theme.Text
    sliderThumb.Parent = sliderTrack

    local thumbCorner = Instance.new("UICorner", sliderThumb)
    thumbCorner.CornerRadius = UDim.new(1, 0)

    local dragging = false

    sliderTrack.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = true
        end
    end)

    UserInputService.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = false
        end
    end)

    UserInputService.InputChanged:Connect(function(input)
        if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
            local x = (input.Position.X - sliderTrack.AbsolutePosition.X) / sliderTrack.AbsoluteSize.X
            x = math.clamp(x, 0, 1)
            espDistTransparency = x
            sliderFill.Size = UDim2.new(x, 0, 1, 0)
            sliderThumb.Position = UDim2.new(x, -10, 0.5, -10)
            updateESPDistColors()
        end
    end)
    
    -- Botão para aplicar as cores
    local applyButton = CreateButton(espColorsTab, "Aplicar Cores", updateESPDistColors)
    applyButton.Position = UDim2.new(0, 0, 0, 130)
end

-- ==================== ESP FUNCTIONS COM VERIFICAÇÃO DE TIME ====================
local espDistConnections = {}
local espDistToggle = CreateToggle(espTab, "Distance ESP", false, function(state)
    _G.ESP_Dist_Ativo = state

    local function criarTexto()
        local fundo = Drawing.new("Square")
        fundo.Color = Color3.new(0, 0, 0)
        fundo.Thickness = 0
        fundo.Filled = true
        fundo.Transparency = 0.4
        fundo.Visible = false

        local texto = Drawing.new("Text")
        texto.Size = 16
        texto.Color = espDistColor
        texto.Center = true
        texto.Outline = true
        texto.Visible = false

        return {fundo = fundo, texto = texto}
    end

    local function atualizarTexto(jogador, objetos)
        if not _G.ESP_Dist_Ativo then
            objetos.fundo.Visible = false
            objetos.texto.Visible = false
            return
        end

        -- VERIFICA SE É INIMIGO
        if not IsEnemy(jogador) then
            objetos.fundo.Visible = false
            objetos.texto.Visible = false
            return
        end

        local char = jogador.Character
        if not char or not char:FindFirstChild("HumanoidRootPart") then
            objetos.fundo.Visible = false
            objetos.texto.Visible = false
            return
        end

        local hrp = char.HumanoidRootPart
        local pos, onScreen = workspace.CurrentCamera:WorldToViewportPoint(hrp.Position)
        if not onScreen then
            objetos.fundo.Visible = false
            objetos.texto.Visible = false
            return
        end

        local distancia = math.floor((hrp.Position - workspace.CurrentCamera.CFrame.Position).Magnitude)
        local textoStr = tostring(distancia) .. "m"

        objetos.texto.Text = textoStr
        objetos.texto.Position = Vector2.new(pos.X, pos.Y - 25)
        objetos.texto.Visible = true
        objetos.texto.Color = espDistColor

        local largura = #textoStr * 7
        objetos.fundo.Position = Vector2.new(pos.X - largura / 2 - 5, pos.Y - 23)
        objetos.fundo.Size = Vector2.new(largura + 0, 0)
        objetos.fundo.Visible = true
    end

    if state then
        for _, jogador in pairs(Players:GetPlayers()) do
            if jogador ~= LocalPlayer then
                textos[jogador] = criarTexto()
            end
        end

        table.insert(espDistConnections, Players.PlayerAdded:Connect(function(jogador)
            if jogador ~= LocalPlayer then
                textos[jogador] = criarTexto()
            end
        end))

        table.insert(espDistConnections, Players.PlayerRemoving:Connect(function(jogador)
            if textos[jogador] then
                textos[jogador].fundo:Remove()
                textos[jogador].texto:Remove()
                textos[jogador] = nil
            end
        end))

        table.insert(espDistConnections, RunService.RenderStepped:Connect(function()
            for jogador, objetos in pairs(textos) do
                atualizarTexto(jogador, objetos)
            end
        end))
    else
        for _, connection in ipairs(espDistConnections) do
            connection:Disconnect()
        end
        espDistConnections = {}

        for _, objetos in pairs(textos) do
            objetos.fundo:Remove()
            objetos.texto:Remove()
        end
        textos = {}
    end
end)

local espLineToggle = CreateToggle(espTab, "Line ESP", false, function(state)
    _G.ESP_Linha_Ativo = state
    
    local function criarLinha()
        local linha = Drawing.new("Line")
        linha.Thickness = 2
        linha.Color = Color3.fromRGB(255, 255, 255) -- Branco fixo
        linha.Visible = false
        return linha
    end

    local function atualizarLinha(jogador, linha)
        if not _G.ESP_Linha_Ativo then
            linha.Visible = false
            return
        end

        -- VERIFICA SE É INIMIGO
        if not IsEnemy(jogador) then
            linha.Visible = false
            return
        end

        local char = jogador.Character
        if not char or not char:FindFirstChild("HumanoidRootPart") then
            linha.Visible = false
            return
        end

        local pos3D = char.HumanoidRootPart.Position + Vector3.new(0, 1.5, 0)
        local pos2D, onScreen = Camera:WorldToViewportPoint(pos3D)

        if onScreen then
            linha.From = Vector2.new(Camera.ViewportSize.X / 2, 0)
            linha.To = Vector2.new(pos2D.X, pos2D.Y)
            linha.Color = Color3.fromRGB(255, 255, 255) -- Sempre branco
            linha.Visible = true
        else
            linha.Visible = false
        end
    end

    if state then
        for _, jogador in pairs(Players:GetPlayers()) do
            if jogador ~= LocalPlayer then
                linhas[jogador] = criarLinha()
            end
        end

        Players.PlayerAdded:Connect(function(jogador)
            if jogador ~= LocalPlayer then
                linhas[jogador] = criarLinha()
            end
        end)

        Players.PlayerRemoving:Connect(function(jogador)
            if linhas[jogador] then
                linhas[jogador]:Remove()
                linhas[jogador] = nil
            end
        end)

        RunService.RenderStepped:Connect(function()
            for jogador, linha in pairs(linhas) do
                atualizarLinha(jogador, linha)
            end
        end)
    else
        for _, linha in pairs(linhas) do
            linha:Remove()
        end
        linhas = {}
    end
end)

local espSkeletonToggle = CreateToggle(espTab, "Skeleton ESP", false, function(state)
    _G.ESP_Skeleton_Ativo = state
    
    local function criarLinha()
        local l = Drawing.new("Line")
        l.Color = Color3.fromRGB(255, 255, 255) -- Branco fixo
        l.Thickness = 1.5
        l.Visible = false
        return l
    end

    local function adicionarJogador(p)
        if p ~= LocalPlayer then
            skeletonLines[p] = {}
            for i = 1, 5 do
                table.insert(skeletonLines[p], criarLinha())
            end
        end
    end

    local function getPos(character, partName)
        local part = character:FindFirstChild(partName)
        if part then
            local pos, onScreen = Camera:WorldToViewportPoint(part.Position)
            if onScreen then
                return pos
            end
        end
        return nil
    end

    if state then
        for _, p in pairs(Players:GetPlayers()) do
            adicionarJogador(p)
        end

        Players.PlayerAdded:Connect(adicionarJogador)

        Players.PlayerRemoving:Connect(function(p)
            if skeletonLines[p] then
                for _, l in ipairs(skeletonLines[p]) do
                    l:Remove()
                end
                skeletonLines[p] = nil
            end
        end)

        RunService.RenderStepped:Connect(function()
            for p, linhasJogador in pairs(skeletonLines) do
                local char = p.Character
                if not char or not _G.ESP_Skeleton_Ativo then
                    for _, l in ipairs(linhasJogador) do l.Visible = false end
                    continue
                end

                -- VERIFICA SE É INIMIGO
                if not IsEnemy(p) then
                    for _, l in ipairs(linhasJogador) do l.Visible = false end
                    continue
                end

                local head = getPos(char, "Head")
                local torso = getPos(char, "UpperTorso") or getPos(char, "Torso")
                local lHand = getPos(char, "LeftHand") or getPos(char, "Left Arm")
                local rHand = getPos(char, "RightHand") or getPos(char, "Right Arm")
                local lFoot = getPos(char, "LeftFoot") or getPos(char, "Left Leg")
                local rFoot = getPos(char, "RightFoot") or getPos(char, "Right Leg")

                if head and torso and lHand and rHand and lFoot and rFoot then
                    -- Sempre branco, sem mudança de cor
                    for _, linha in ipairs(linhasJogador) do
                        linha.Color = Color3.fromRGB(255, 255, 255)
                    end
                    
                    linhasJogador[1].From = Vector2.new(head.X, head.Y)
                    linhasJogador[1].To = Vector2.new(torso.X, torso.Y)
                    linhasJogador[1].Visible = true

                    linhasJogador[2].From = Vector2.new(torso.X, torso.Y)
                    linhasJogador[2].To = Vector2.new(lHand.X, lHand.Y)
                    linhasJogador[2].Visible = true

                    linhasJogador[3].From = Vector2.new(torso.X, torso.Y)
                    linhasJogador[3].To = Vector2.new(rHand.X, rHand.Y)
                    linhasJogador[3].Visible = true

                    linhasJogador[4].From = Vector2.new(torso.X, torso.Y)
                    linhasJogador[4].To = Vector2.new(lFoot.X, lFoot.Y)
                    linhasJogador[4].Visible = true

                    linhasJogador[5].From = Vector2.new(torso.X, torso.Y)
                    linhasJogador[5].To = Vector2.new(rFoot.X, rFoot.Y)
                    linhasJogador[5].Visible = true
                else
                    for _, l in ipairs(linhasJogador) do l.Visible = false end
                end
            end
        end)
    else
        for _, linhasJogador in pairs(skeletonLines) do
            for _, l in ipairs(linhasJogador) do
                l:Remove()
            end
        end
        skeletonLines = {}
    end
end)

local espVidaToggle = CreateToggle(espTab, "Health ESP", false, function(state)
    _G.ESP_Vida_Ativo = state
    
    local function getLifeColor(pct)
        if pct > 0.5 then
            return Color3.fromRGB(0, 255, 0) -- Verde
        elseif pct > 0.2 then
            return Color3.fromRGB(255, 165, 0) -- Laranja
        else
            return Color3.fromRGB(255, 0, 0) -- Vermelho
        end
    end

    local function criarBarraDeVida(jogador)
        local function setup()
            if not _G.ESP_Vida_Ativo then return end

            local char = jogador.Character
            if not char then return end

            local head = char:FindFirstChild("Head")
            local humanoid = char:FindFirstChildOfClass("Humanoid")
            if not head or not humanoid then return end

            -- VERIFICA SE É INIMIGO
            if not IsEnemy(jogador) then
                return -- Ignora aliados
            end

            -- Evita duplicatas
            if head:FindFirstChild("VidaESP") then return end

            local billboard = Instance.new("BillboardGui")
            billboard.Name = "VidaESP"
            billboard.Size = UDim2.new(0, 40, 0, 6)
            billboard.StudsOffset = Vector3.new(0, 2.5, 0)
            billboard.AlwaysOnTop = true
            billboard.Parent = head

            local barra = Instance.new("Frame")
            barra.BackgroundColor3 = getLifeColor(humanoid.Health / humanoid.MaxHealth)
            barra.Size = UDim2.new(humanoid.Health / humanoid.MaxHealth, 0, 1, 0)
            barra.BorderSizePixel = 0
            barra.Position = UDim2.new(0, 0, 0, 0)
            barra.Parent = billboard

            healthBars[jogador] = {billboard = billboard, barra = barra, humanoid = humanoid}

            -- Atualiza a barra ao mudar a vida
            humanoid.HealthChanged:Connect(function()
                if not _G.ESP_Vida_Ativo then
                    billboard.Enabled = false
                    return
                end

                local pct = humanoid.Health / humanoid.MaxHealth
                barra.Size = UDim2.new(math.clamp(pct, 0, 1), 0, 1, 0)
                barra.BackgroundColor3 = getLifeColor(pct)
                billboard.Enabled = true
            end)
        end

        -- Inicializa e reaplica ao renascer
        if jogador.Character then
            setup()
        end

        jogador.CharacterAdded:Connect(function()
            wait(1)
            setup()
        end)
    end

    local function removerBarraDeVida(jogador)
        if healthBars[jogador] then
            if healthBars[jogador].billboard and healthBars[jogador].billboard.Parent then
                healthBars[jogador].billboard:Destroy()
            end
            healthBars[jogador] = nil
        end
    end

    if state then
        -- Aplicar a todos os jogadores
        for _, jogador in pairs(Players:GetPlayers()) do
            if jogador ~= LocalPlayer then
                criarBarraDeVida(jogador)
            end
        end

        -- Novos jogadores
        Players.PlayerAdded:Connect(function(jogador)
            if jogador ~= LocalPlayer then
                criarBarraDeVida(jogador)
            end
        end)

        Players.PlayerRemoving:Connect(function(jogador)
            removerBarraDeVida(jogador)
        end)
    else
        -- Remover todas as barras de vida
        for jogador, _ in pairs(healthBars) do
            removerBarraDeVida(jogador)
        end
        healthBars = {}
    end
end)

-- ESP NAME (NOVO) COM VERIFICAÇÃO DE TIME
local espNameToggle = CreateToggle(espTab, "Name ESP", false, function(state)
    _G.ESP_Name_Ativo = state
    
    local function criarNomeESP(jogador)
        local texto = Drawing.new("Text")
        texto.Text = jogador.Name
        texto.Size = 18
        texto.Color = Color3.fromRGB(255, 255, 255) -- Branco fixo
        texto.Center = true
        texto.Outline = true
        texto.Visible = false
        
        local fundo = Drawing.new("Square")
        fundo.Color = Color3.new(0, 0, 0)
        fundo.Thickness = 0
        fundo.Filled = true
        fundo.Transparency = 0.5
        fundo.Visible = false
        
        return {texto = texto, fundo = fundo}
    end

    local function atualizarNomeESP(jogador, objetos)
        if not _G.ESP_Name_Ativo then
            objetos.texto.Visible = false
            objetos.fundo.Visible = false
            return
        end

        -- VERIFICA SE É INIMIGO
        if not IsEnemy(jogador) then
            objetos.texto.Visible = false
            objetos.fundo.Visible = false
            return
        end

        local char = jogador.Character
        if not char or not char:FindFirstChild("HumanoidRootPart") then
            objetos.texto.Visible = false
            objetos.fundo.Visible = false
            return
        end

        local hrp = char.HumanoidRootPart
        local pos, onScreen = Camera:WorldToViewportPoint(hrp.Position + Vector3.new(0, 3, 0))
        if not onScreen then
            objetos.texto.Visible = false
            objetos.fundo.Visible = false
            return
        end

        objetos.texto.Text = jogador.Name
        objetos.texto.Position = Vector2.new(pos.X, pos.Y)
        objetos.texto.Color = Color3.fromRGB(255, 255, 255) -- Sempre branco
        objetos.texto.Visible = true
        
        local textWidth = #jogador.Name * 9
        objetos.fundo.Position = Vector2.new(pos.X - textWidth / 2 - 3, pos.Y - 10)
        objetos.fundo.Size = Vector2.new(textWidth + 0, 0)
        objetos.fundo.Visible = true
    end

    if state then
        for _, jogador in pairs(Players:GetPlayers()) do
            if jogador ~= LocalPlayer then
                nameTags[jogador] = criarNomeESP(jogador)
            end
        end

        Players.PlayerAdded:Connect(function(jogador)
            if jogador ~= LocalPlayer then
                nameTags[jogador] = criarNomeESP(jogador)
            end
        end)

        Players.PlayerRemoving:Connect(function(jogador)
            if nameTags[jogador] then
                nameTags[jogador].texto:Remove()
                nameTags[jogador].fundo:Remove()
                nameTags[jogador] = nil
            end
        end)

        RunService.RenderStepped:Connect(function()
            for jogador, objetos in pairs(nameTags) do
                atualizarNomeESP(jogador, objetos)
            end
        end)
    else
        for _, objetos in pairs(nameTags) do
            objetos.texto:Remove()
            objetos.fundo:Remove()
        end
        nameTags = {}
    end
end)

-- ==================== CHAMS FUNCTIONS COM VERIFICAÇÃO DE TIME ====================
local function applyChams(color, transparency)
    local function createHighlight(player)
        if player == LocalPlayer then return end
        -- VERIFICA SE É INIMIGO
        if not IsEnemy(player) then return end
        if not player.Character then return end
        if chamsHighlights[player] then return end

        local highlight = Instance.new("Highlight")
        highlight.Name = "ChamsHighlight"
        highlight.FillColor = color
        highlight.OutlineColor = Color3.new(0, 0, 0)
        highlight.FillTransparency = transparency or 0.3
        highlight.OutlineTransparency = 0
        highlight.Adornee = player.Character
        highlight.Parent = player.Character
        
        chamsHighlights[player] = highlight
    end

    local function removeHighlight(player)
        if chamsHighlights[player] then
            chamsHighlights[player]:Destroy()
            chamsHighlights[player] = nil
        end
    end

    -- Remover todos os highlights existentes
    for _, highlight in pairs(chamsHighlights) do
        highlight:Destroy()
    end
    chamsHighlights = {}

    -- Aplicar novos highlights apenas em inimigos
    for _, player in ipairs(Players:GetPlayers()) do
        player.CharacterAdded:Connect(function()
            task.wait(1)
            createHighlight(player)
        end)
        if player.Character then
            createHighlight(player)
        end
    end

    Players.PlayerAdded:Connect(function(player)
        player.CharacterAdded:Connect(function()
            task.wait(1)
            createHighlight(player)
        end)
    end)

    Players.PlayerRemoving:Connect(function(player)
        removeHighlight(player)
    end)
end

CreateButton(chamsTab, "Transparent Chams", function()
    applyChams(Color3.new(0, 0, 0), 0.7)
end)

CreateButton(chamsTab, "Red Chams", function()
    applyChams(Color3.fromRGB(150, 0, 0))
end)

CreateButton(chamsTab, "Yellow Chams", function()
    applyChams(Color3.fromRGB(200, 200, 0))
end)

CreateButton(chamsTab, "Blue Chams", function()
    applyChams(Color3.fromRGB(0, 0, 150))
end)

CreateButton(chamsTab, "Green Chams", function()
    applyChams(Color3.fromRGB(0, 150, 0))
end)

CreateButton(chamsTab, "White Chams", function()
    applyChams(Color3.fromRGB(200, 200, 200))
end)

CreateButton(chamsTab, "Purple Chams", function()
    applyChams(Color3.fromRGB(150, 0, 150))
end)

CreateButton(chamsTab, "Remove All Chams", function()
    for _, highlight in pairs(chamsHighlights) do
        highlight:Destroy()
    end
    chamsHighlights = {}
end)

-- ==================== AIMBOT COM VERIFICAÇÃO DE TIME ====================
local AimFov = 70
local AimSmoothing = 0.5
local AimPart = "Head"
local AimTeamCheck = true -- Agora usa a função IsEnemy
local AimVisible = false

-- Toggles do Aimbot (o toggle principal controla TUDO)
local aimbotToggle = CreateToggle(aimbotTab, "Aimbot", false, function(state)
    _G.Aimbot_Ativo = state
end)

local aimTeamToggle = CreateToggle(aimbotTab, "Team Check", true, function(state)
    AimTeamCheck = state
end)

local aimVisibleToggle = CreateToggle(aimbotTab, "Visible Check", false, function(state)
    AimVisible = state
end)

local combinedSlider = CreateSlider(aimbotTab, "FOV & Smoothing", 10, 360, 70, function(value)
    AimFov = value
    
    -- Usando função quadrática para suavidade
    local x = value / 360  -- Normalizado de 0 a 1
    local smoothingValue = 0.1 + (x * x * 1.9)  -- Cresce devagar no começo, rápido no final
    
    AimSmoothing = smoothingValue
end, function(value)
    local x = value / 360
    local smoothingValue = 0.1 + (x * x * 1.9)
    return string.format("FOV: %.0f° | Smooth: %.3f", value, smoothingValue)
end)

-- Aim Part Selector
CreateButton(aimbotTab, "Aim Part: Head", function(btn)
    AimPart = AimPart == "Head" and "HumanoidRootPart" or "Head"
    btn.Text = "Aim Part: "..AimPart
end)

-- Main Aimbot Logic
local function IsVisible(targetPart)
    local origin = Camera.CFrame.Position
    local direction = (targetPart.Position - origin).Unit
    local ray = Ray.new(origin, direction * 1000)

    local hit, position = workspace:FindPartOnRay(ray, LocalPlayer.Character)
    return hit and (hit == targetPart or hit:IsDescendantOf(targetPart.Parent))
end

local function GetClosestPlayer()
    local mousePos = Vector2.new(Camera.ViewportSize.X / 2, Camera.ViewportSize.Y / 2)
    local closestPlayer, shortestDistance = nil, AimFov

    for _, player in ipairs(Players:GetPlayers()) do
        -- VERIFICA SE É INIMIGO (usando a função principal)
        if AimTeamCheck and not IsEnemy(player) then
            continue
        end
        
        if player ~= LocalPlayer and player.Character and player.Character:FindFirstChild(AimPart) and player.Character:FindFirstChild("Humanoid") then
            local humanoid = player.Character.Humanoid
            if humanoid.Health > 0 then
                local part = player.Character[AimPart]
                local screenPos, onScreen = Camera:WorldToViewportPoint(part.Position)

                if onScreen then
                    if AimVisible and not IsVisible(part) then
                        continue
                    end

                    local distance = (Vector2.new(screenPos.X, screenPos.Y) - mousePos).Magnitude
                    if distance < shortestDistance then
                        shortestDistance = distance
                        closestPlayer = player
                    end
                end
            end
        end
    end
    return closestPlayer
end

-- Loop principal do aimbot (ativo apenas quando o toggle está ON)
RunService.RenderStepped:Connect(function()
    if not _G.Aimbot_Ativo then return end

    local target = GetClosestPlayer()
    if target and target.Character and target.Character:FindFirstChild(AimPart) then
        -- Suavização do movimento da câmera
        local currentCF = Camera.CFrame
        local targetPos = target.Character[AimPart].Position
        local direction = (targetPos - currentCF.Position).Unit
        local targetCF = CFrame.new(currentCF.Position, currentCF.Position + direction)
        
        -- Aplica suavização
        Camera.CFrame = currentCF:Lerp(targetCF, AimSmoothing)
    end
end)

-- Adiciona um aviso sobre como funciona
CreateButton(aimbotTab, "INFO: Ative/Desative no Menu", function()
    local notif = Instance.new("TextLabel")
    notif.Text = "Aimbot: Ative/Desative no toggle acima"
    notif.TextSize = 14
    notif.TextColor3 = Theme.Accent
    notif.BackgroundColor3 = Theme.Background
    notif.Size = UDim2.new(0, 300, 0, 40)
    notif.Position = UDim2.new(0.5, -150, 0.5, -20)
    notif.AnchorPoint = Vector2.new(0.5, 0.5)
    notif.Font = Enum.Font.GothamBold
    notif.Parent = ScreenGui
    
    Instance.new("UICorner", notif).CornerRadius = UDim.new(0.1, 0)
    
    wait(2)
    notif:Destroy()
end)

-- ==================== PLAYER MODIFICATIONS ====================
local walkSpeed = 16
local jumpPower = 50
local noclipActive = false

-- Walk Speed Slider
local speedSlider = CreateSlider(playerTab, "Walk Speed", 16, 200, walkSpeed, function(value)
    walkSpeed = value
    if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
        LocalPlayer.Character.Humanoid.WalkSpeed = value
    end
end, function(value)
    return string.format("%.0f", value)
end)

-- Jump Power Slider
local jumpSlider = CreateSlider(playerTab, "Jump Power", 50, 200, jumpPower, function(value)
    jumpPower = value
    if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") then
        LocalPlayer.Character.Humanoid.JumpPower = value
    end
end, function(value)
    return string.format("%.0f", value)
end)

-- Noclip Toggle
local noclipToggle = CreateToggle(playerTab, "Noclip (N)", false, function(state)
    noclipActive = state
end)

-- ==================== UTILS ====================
CreateButton(utilsTab, "Copy Coordinates", function()
    if LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("HumanoidRootPart") then
        local pos = LocalPlayer.Character.HumanoidRootPart.Position
        local text = string.format("Position: X=%.2f, Y=%.2f, Z=%.2f", pos.X, pos.Y, pos.Z)
        
        pcall(function()
            setclipboard(text)
        end)
        
        local notif = Instance.new("TextLabel")
        notif.Text = "Coordinates Copied!"
        notif.TextSize = 14
        notif.TextColor3 = Theme.Success
        notif.BackgroundColor3 = Theme.Background
        notif.Size = UDim2.new(0, 200, 0, 40)
        notif.Position = UDim2.new(0.5, -100, 0.2, 0)
        notif.AnchorPoint = Vector2.new(0.5, 0)
        notif.Font = Enum.Font.GothamBold
        notif.Parent = ScreenGui
    
        Instance.new("UICorner", notif).CornerRadius = UDim.new(0.1, 0)
        
        wait(2)
        notif:Destroy()
    end
end)

CreateButton(utilsTab, "Server Hop", function()
    -- Implementação de Server Hop
end)

CreateButton(utilsTab, "Anti-AFK", function()
    local vu = game:GetService("VirtualUser")
    game:GetService("Players").LocalPlayer.Idled:Connect(function()
        vu:Button2Down(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
        wait(1)
        vu:Button2Up(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
    end)
end)

-- ==================== NOVO SISTEMA DE DRAGGING ====================

-- Botão flutuante dragging
local floatDragging = false
local floatDragStart = Vector2.new()
local floatStartPos = UDim2.new()

FloatButton.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1 then
        floatDragging = true
        floatDragStart = input.Position
        floatStartPos = FloatButton.Position
        
        input.Changed:Connect(function()
            if input.UserInputState == Enum.UserInputState.End then
                floatDragging = false
            end
        end)
    end
end)

-- Botão flutuante dragging
UserInputService.InputChanged:Connect(function(input)
    if floatDragging and (input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseMovement) then
        local delta = input.Position - floatDragStart
        local newPos = UDim2.new(
            floatStartPos.X.Scale,
            math.clamp(floatStartPos.X.Offset + delta.X, 
                       -20,  -- ← ESQUERDA: Permite sair 20px da tela
                       workspace.CurrentCamera.ViewportSize.X - FloatButton.AbsoluteSize.X + 20),  -- ← DIREITA: Permite sair 20px
            floatStartPos.Y.Scale,
            math.clamp(floatStartPos.Y.Offset + delta.Y, 
                       -450,  -- ← TOPO: Pode subir 200px
                       workspace.CurrentCamera.ViewportSize.Y - FloatButton.AbsoluteSize.Y + 20)  -- ← BASE: Pode descer 20px a mais
        )
        FloatButton.Position = newPos
    end
end)

-- Painel principal dragging (arrasta pelo header)
local panelDragging = false
local panelDragStart = Vector2.new()
local panelStartPos = UDim2.new()

header.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1 then
        panelDragging = true
        panelDragStart = input.Position
        panelStartPos = MainPanel.Position
        
        input.Changed:Connect(function()
            if input.UserInputState == Enum.UserInputState.End then
                panelDragging = false
            end
        end)
    end
end)

-- Painel principal dragging
UserInputService.InputChanged:Connect(function(input)
    if panelDragging and (input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseMovement) then
        local delta = input.Position - panelDragStart
        local newPos = UDim2.new(
            panelStartPos.X.Scale,
            math.clamp(panelStartPos.X.Offset + delta.X, 
                       -1300,  -- ← ESQUERDA: Não encosta, deixa 20px de margem
                       workspace.CurrentCamera.ViewportSize.X - MainPanel.AbsoluteSize.X - -1300),  -- ← DIREITA: Não encosta
            panelStartPos.Y.Scale,
            math.clamp(panelStartPos.Y.Offset + delta.Y, 
                       -100,  -- ← TOPO: Não encosta no topo, deixa 40px
                       workspace.CurrentCamera.ViewportSize.Y - MainPanel.AbsoluteSize.Y - -400)  -- ← BASE: Não encosta na base
        )
        MainPanel.Position = newPos
    end
end)

-- ==================== KEYBINDS ====================
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
    -- Noclip toggle
    if input.KeyCode == Enum.KeyCode.N then
        noclipActive = not noclipActive
        if noclipToggle then
            noclipToggle.SetState(noclipActive)
        end
    end
    
    -- Hide UI
    if input.KeyCode == Enum.KeyCode.H then
        ScreenGui.Enabled = not ScreenGui.Enabled
    end
end)

-- Noclip loop
RunService.Stepped:Connect(function()
    if noclipActive and LocalPlayer.Character then
        for _, part in pairs(LocalPlayer.Character:GetDescendants()) do
            if part:IsA("BasePart") and part.CanCollide then
                part.CanCollide = false
            end
        end
    end
end)

-- Atualizar tamanho do content scroller
RunService.RenderStepped:Connect(function()
    if CurrentTab and Tabs[CurrentTab] and Tabs[CurrentTab].Content:FindFirstChildOfClass("UIListLayout") then
        local layout = Tabs[CurrentTab].Content:FindFirstChildOfClass("UIListLayout")
        contentScroller.CanvasSize = UDim2.new(0, 0, 0, layout.AbsoluteContentSize.Y + 20)
    end
end)

-- Notificação inicial
local function showNotification(text, color)
    local notif = Instance.new("TextLabel")
    notif.Text = text
    notif.TextSize = 16
    notif.TextColor3 = color or Theme.Text
    notif.BackgroundColor3 = Theme.Background
    notif.Size = UDim2.new(0, 300, 0, 50)
    notif.Position = UDim2.new(0.5, -150, 0.1, 0)
    notif.AnchorPoint = Vector2.new(0.5, 0)
    notif.Font = Enum.Font.GothamBold
    notif.Parent = ScreenGui
    
    Instance.new("UICorner", notif).CornerRadius = UDim.new(0.1, 0)
    
    wait(3)
    notif:Destroy()
end

showNotification("YouTube RN TEAM!!", Theme.Success)
