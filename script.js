repeat task.wait() until game:IsLoaded()
wait(1)

-- Services
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local Lighting = game:GetService("Lighting") -- Unused in this script, but kept from original
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Camera = workspace.CurrentCamera -- Added for Aimbot functionality

-- UI Setup
local guiReady, PlayerGui = pcall(function()
    return LocalPlayer:WaitForChild("PlayerGui", 5)
end)

if not guiReady or not PlayerGui then
    warn("PlayerGui not loaded.")
    return
end

-- Main UI Container
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "RNMobileUI"
ScreenGui.ResetOnSpawn = false
ScreenGui.IgnoreGuiInset = true
ScreenGui.Parent = PlayerGui

-- UI Theme
local Theme = {
    Background = Color3.fromRGB(30, 30, 40),
    Button = Color3.fromRGB(50, 50, 60),
    ButtonHover = Color3.fromRGB(70, 70, 80),
    Accent = Color3.fromRGB(0, 170, 255),
    Text = Color3.new(1, 1, 1),
    TabActive = Color3.fromRGB(0, 120, 215),
    TabInactive = Color3.fromRGB(60, 60, 80),
    TabHover = Color3.fromRGB(80, 80, 100)
}

-- Floating Toggle Button (now draggable)
local FloatButton = Instance.new("TextButton")
FloatButton.Name = "ToggleButton"
FloatButton.Size = UDim2.new(0, 60, 0, 60)
FloatButton.Position = UDim2.new(0, 20, 0.5, -30)
FloatButton.Text = "☰"
FloatButton.TextSize = 24
FloatButton.BackgroundColor3 = Theme.Accent
FloatButton.TextColor3 = Theme.Text
FloatButton.Font = Enum.Font.GothamBold
FloatButton.BorderSizePixel = 0
FloatButton.ZIndex = 10
FloatButton.Parent = ScreenGui

local buttonCorner = Instance.new("UICorner", FloatButton)
buttonCorner.CornerRadius = UDim.new(1, 0)

-- Main Panel (not draggable)
local MainPanel = Instance.new("Frame")
MainPanel.Name = "MainPanel"
MainPanel.Size = UDim2.new(0, 320, 0, 450)
MainPanel.Position = UDim2.new(0, 90, 0.5, -225)
MainPanel.BackgroundColor3 = Theme.Background
MainPanel.Visible = false
MainPanel.Parent = ScreenGui

local panelCorner = Instance.new("UICorner", MainPanel)
panelCorner.CornerRadius = UDim.new(0, 12)

local panelShadow = Instance.new("ImageLabel", MainPanel)
panelShadow.Name = "Shadow"
panelShadow.Image = "rbxassetid://1316045217" -- Ensure this asset ID is valid or replace with a generic shadow/frame
panelShadow.ImageColor3 = Color3.new(0, 0, 0)
panelShadow.ImageTransparency = 0.8
panelShadow.ScaleType = Enum.ScaleType.Slice
panelShadow.SliceCenter = Rect.new(10, 10, 118, 118)
panelShadow.Size = UDim2.new(1, 10, 1, 10)
panelShadow.Position = UDim2.new(0, -5, 0, -5)
panelShadow.BackgroundTransparency = 1
panelShadow.ZIndex = -1

-- Tab System
local TabButtonsContainer = Instance.new("Frame")
TabButtonsContainer.Name = "TabButtonsContainer"
TabButtonsContainer.Size = UDim2.new(1, 0, 0, 60)
TabButtonsContainer.Position = UDim2.new(0, 0, 0, 0)
TabButtonsContainer.BackgroundTransparency = 1
TabButtonsContainer.ClipsDescendants = true
TabButtonsContainer.Parent = MainPanel

local TabScroller = Instance.new("ScrollingFrame")
TabScroller.Name = "TabScroller"
TabScroller.Size = UDim2.new(1, 0, 1, 0)
TabScroller.BackgroundTransparency = 1
TabScroller.ScrollBarThickness = 0
TabScroller.ScrollingDirection = Enum.ScrollingDirection.X
TabScroller.VerticalScrollBarPosition = Enum.VerticalScrollBarPosition.Left
TabScroller.Parent = TabButtonsContainer

local TabButtonsLayout = Instance.new("UIListLayout", TabScroller)
TabButtonsLayout.FillDirection = Enum.FillDirection.Horizontal
TabButtonsLayout.Padding = UDim.new(0, 10)
TabButtonsLayout.VerticalAlignment = Enum.VerticalAlignment.Center

local TabContainer = Instance.new("Frame")
TabContainer.Name = "TabContainer"
TabContainer.Size = UDim2.new(1, -20, 1, -80)
TabContainer.Position = UDim2.new(0, 10, 0, 80)
TabContainer.BackgroundTransparency = 1
TabContainer.Parent = MainPanel

local Tabs = {}
local CurrentTab = nil

-- Function to create a tab
local function CreateTab(tabName)
    local TabButton = Instance.new("TextButton")
    TabButton.Name = tabName.."Tab"
    TabButton.Size = UDim2.new(0, 140, 0.65, 0)
    TabButton.Text = tabName
    TabButton.TextSize = 18
    TabButton.BackgroundColor3 = Theme.TabInactive
    TabButton.TextColor3 = Theme.Text
    TabButton.Font = Enum.Font.GothamBold
    TabButton.AutoButtonColor = false
    TabButton.Parent = TabScroller
    
    local tabCorner = Instance.new("UICorner", TabButton)
    tabCorner.CornerRadius = UDim.new(0, 10)
    
    TabButton.MouseEnter:Connect(function()
        if CurrentTab ~= tabName then
            game:GetService("TweenService"):Create(
                TabButton,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.TabHover}
            ):Play()
        end
    end)
    
    TabButton.MouseLeave:Connect(function()
        if CurrentTab ~= tabName then
            game:GetService("TweenService"):Create(
                TabButton,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.TabInactive}
            ):Play()
        end
    end)
    
    local TabFrame = Instance.new("ScrollingFrame")
    TabFrame.Name = tabName.."Frame"
    TabFrame.Size = UDim2.new(1, 0, 1, 0)
    TabFrame.BackgroundTransparency = 1
    TabFrame.Visible = false
    TabFrame.ScrollBarThickness = 8
    TabFrame.ScrollingDirection = Enum.ScrollingDirection.Y
    TabFrame.Parent = TabContainer
    
    local UIList = Instance.new("UIListLayout", TabFrame)
    UIList.Padding = UDim.new(0, 10)
    
    Tabs[tabName] = {
        Button = TabButton,
        Frame = TabFrame,
        UIList = UIList
    }
    
    TabButton.MouseButton1Click:Connect(function()
        for name, tab in pairs(Tabs) do
            tab.Frame.Visible = (name == tabName)
            tab.Button.BackgroundColor3 = (name == tabName) and Theme.TabActive or Theme.TabInactive
        end
        CurrentTab = tabName
    end)
    
    if not CurrentTab then
        CurrentTab = tabName
        TabButton.BackgroundColor3 = Theme.TabActive
        TabFrame.Visible = true
    end
    
    TabButtonsLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
        TabScroller.CanvasSize = UDim2.new(0, TabButtonsLayout.AbsoluteContentSize.X + 20, 0, 0)
    end)
    
    return TabFrame
end

-- Function to create a button in a tab
local function CreateButton(tabName, buttonText, callback)
    if not Tabs[tabName] then
        warn("Tab '"..tabName.."' doesn't exist!")
        return
    end
    
    local btn = Instance.new("TextButton")
    btn.Name = buttonText.."Button"
    btn.Size = UDim2.new(1, 0, 0, 45)
    btn.Text = buttonText
    btn.TextSize = 14
    btn.BackgroundColor3 = Theme.Button
    btn.TextColor3 = Theme.Text
    btn.Font = Enum.Font.Gotham
    btn.AutoButtonColor = true
    btn.Parent = Tabs[tabName].Frame
    
    local btnCorner = Instance.new("UICorner", btn)
    btnCorner.CornerRadius = UDim.new(0, 6)
    
    btn.MouseEnter:Connect(function()
        if not btn:GetAttribute("Toggled") then
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.ButtonHover}
            ):Play()
        end
    end)
    
    btn.MouseLeave:Connect(function()
        if not btn:GetAttribute("Toggled") then
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.Button}
            ):Play()
        end
    end)
    
    btn.MouseButton1Click:Connect(function()
        game:GetService("TweenService"):Create(
            btn,
            TweenInfo.new(0.1),
            {BackgroundColor3 = Theme.Accent}
        ):Play()
        
        wait(0.1)
        
        if not btn:GetAttribute("Toggled") then
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.1),
                {BackgroundColor3 = Theme.ButtonHover}
            ):Play()
        end
        
        callback()
    end)
    
    Tabs[tabName].UIList:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
        Tabs[tabName].Frame.CanvasSize = UDim2.new(0, 0, 0, Tabs[tabName].UIList.AbsoluteContentSize.Y + 10)
    end)
    
    return btn
end

-- Function to create a toggle button
local function CreateToggle(tabName, buttonText, defaultState, callback)
    local btn = CreateButton(tabName, buttonText, function()
        local newState = not btn:GetAttribute("Toggled")
        btn:SetAttribute("Toggled", newState)
        
        if newState then
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.Accent}
            ):Play()
        else
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.Button}
            ):Play()
        end
        
        callback(newState)
    end)
    
    btn:SetAttribute("Toggled", defaultState)
    
    if defaultState then
        btn.BackgroundColor3 = Theme.Accent
    end
    
    return btn
end

-- Function to create a premium toggle switch
local function CreatePremiumToggle(tabName, buttonText, defaultState, callback)
    if not Tabs[tabName] then return end
    
    local toggleFrame = Instance.new("Frame")
    toggleFrame.Name = buttonText.."Toggle"
    toggleFrame.Size = UDim2.new(1, 0, 0, 50)
    toggleFrame.BackgroundTransparency = 1
    toggleFrame.Parent = Tabs[tabName].Frame
    
    local label = Instance.new("TextLabel")
    label.Name = "Label"
    label.Size = UDim2.new(0.6, 0, 1, 0)
    label.Position = UDim2.new(0, 50, 0, 0)
    label.Text = "  "..buttonText
    label.TextSize = 16
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.BackgroundTransparency = 1
    label.TextColor3 = Theme.Text
    label.Font = Enum.Font.GothamBold
    label.Parent = toggleFrame
    
    local toggleBase = Instance.new("Frame")
    toggleBase.Name = "ToggleBase"
    toggleBase.Size = UDim2.new(0.2, 0, 0, 30)
    toggleBase.Position = UDim2.new(0.65, 0, 0.5, -15)
    toggleBase.BackgroundColor3 = Theme.TabInactive
    toggleBase.Parent = toggleFrame
    
    local corner = Instance.new("UICorner", toggleBase)
    corner.CornerRadius = UDim.new(1, 0)
    
    local toggleButton = Instance.new("Frame")
    toggleButton.Name = "ToggleButton"
    toggleButton.Size = UDim2.new(0, 24, 0, 24)
    toggleButton.Position = defaultState and UDim2.new(1, -28, 0.5, -13) or UDim2.new(0, 2, 0.5, -13)
    toggleButton.BackgroundColor3 = defaultState and Theme.Accent or Color3.fromRGB(150, 150, 150)
    toggleButton.Parent = toggleBase
    
    local buttonCorner = Instance.new("UICorner", toggleButton)
    buttonCorner.CornerRadius = UDim.new(1, 0)
    
    local currentState = defaultState
    
    local function updateToggle(state)
        currentState = state
        local tweenInfo = TweenInfo.new(0.2, Enum.EasingStyle.Quad)
        
        TweenService:Create(
            toggleButton,
            tweenInfo,
            {
                Position = state and UDim2.new(1, -28, 0.5, -13) or UDim2.new(0, 2, 0.5, -13),
                BackgroundColor3 = state and Theme.Accent or Color3.fromRGB(150, 150, 150)
            }
        ):Play()
        
        TweenService:Create(
            toggleBase,
            tweenInfo,
            {BackgroundColor3 = state and Color3.fromRGB(40, 80, 120) or Theme.TabInactive}
        ):Play()
        
        callback(state)
    end
    
    toggleFrame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1 then
            updateToggle(not currentState)
        end
    end)
    
    return {
        SetState = function(newState)
            if currentState ~= newState then
                updateToggle(newState)
            end
        end,
        GetState = function()
            return currentState
        end
    }
end

-- Toggle UI visibility (from your GUI framework)
local minimized = true -- Start minimized
FloatButton.MouseButton1Click:Connect(function()
    minimized = not minimized
    MainPanel.Visible = not minimized
    
    if minimized then
        FloatButton.Text = "☰"
        game:GetService("TweenService"):Create(
            FloatButton,
            TweenInfo.new(0.3),
            {Rotation = 0}
        ):Play()
    else
        FloatButton.Text = "✕"
        game:GetService("TweenService"):Create(
            FloatButton,
            TweenInfo.new(0.3),
            {Rotation = 180}
        ):Play()
    end
end)

-- Floating button dragging (from your GUI framework)
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

UserInputService.InputChanged:Connect(function(input)
    if floatDragging and (input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseMovement) then
        local delta = input.Position - floatDragStart
        local newPos = UDim2.new(
            floatStartPos.X.Scale,
            math.clamp(floatStartPos.X.Offset + delta.X, 0, workspace.CurrentCamera.ViewportSize.X - FloatButton.AbsoluteSize.X),
            floatStartPos.Y.Scale,
            math.clamp(floatStartPos.Y.Offset + delta.Y, -290, workspace.CurrentCamera.ViewportSize.Y - FloatButton.AbsoluteSize.Y) -- Corrected Y clamp
        )
        FloatButton.Position = newPos
    end
end)

-- Main panel dragging (from your GUI framework - might not be intended to be draggable)
local panelDragging = false
local panelDragStart = Vector2.new()
local panelStartPos = UDim2.new()

MainPanel.InputBegan:Connect(function(input)
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

UserInputService.InputChanged:Connect(function(input)
    if panelDragging and (input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseMovement) then
        local delta = input.Position - panelDragStart
        local newPos = UDim2.new(
            panelStartPos.X.Scale,
            math.clamp(panelStartPos.X.Offset + delta.X, 0, workspace.CurrentCamera.ViewportSize.X - MainPanel.AbsoluteSize.X),
            panelStartPos.Y.Scale,
            math.clamp(panelStartPos.Y.Offset + delta.Y, -290, workspace.CurrentCamera.ViewportSize.Y - MainPanel.AbsoluteSize.Y) -- Corrected Y clamp
        )
        MainPanel.Position = newPos
    end
end)


-- Create tabs (from your GUI framework)
CreateTab("Main")
CreateTab("CHAMS")
CreateTab("ESP")
local espColorsTab = CreateTab("ESP Colors")
local aimbotTabFrame = CreateTab("AIMBOT") -- Store the frame for the Aim

-- Variáveis globais para os ESPs
_G.ESP_Dist_Ativo = false
_G.ESP_Linha_Ativo = false
_G.ESP_Skeleton_Ativo = false
_G.ESP_Vida_Ativo = false

local textos = {}  -- Para ESP de distância
local linhas = {}  -- Para ESP de linha
local skeletonLines = {}  -- Para ESP esqueleto
local healthBars = {}  -- Para ESP de vida

-- Variáveis para armazenar as cores
local espColor = Color3.fromRGB(255, 0, 0) -- Vermelho padrão
local espTransparency = 1 -- Opacidade máxima padrão

-- Detecta se o jogo tem times (verificado uma vez para otimização)
local jogoTemEquipes = pcall(function() return LocalPlayer.Team ~= nil end) and LocalPlayer.Team ~= nil

-- Função para atualizar todas as cores do ESP
local function updateESPColors()
    -- Atualiza o ESP de distância
    if _G.ESP_Dist_Ativo then
        for _, jogador in pairs(game:GetService("Players"):GetPlayers()) do
            if jogador ~= LocalPlayer and textos[jogador] then
                textos[jogador].texto.Color = espColor
            end
        end
    end
    
    -- Atualiza o ESP de linha
    if _G.ESP_Linha_Ativo then
        for _, linha in pairs(linhas) do
            linha.Color = espColor
            linha.Transparency = 1 - espTransparency
        end
    end
    
    -- Atualiza o ESP esqueleto
    if _G.ESP_Skeleton_Ativo then
        for _, linhasJogador in pairs(skeletonLines) do
            for _, linha in ipairs(linhasJogador) do
                linha.Color = espColor
                linha.Transparency = 1 - espTransparency
            end
        end
    end
end

-- Configuração da aba de cores do ESP
do
    -- Contêiner para as configurações de cor
    local colorContainer = Instance.new("Frame")
    colorContainer.Name = "ColorContainer"
    colorContainer.Size = UDim2.new(1, -20, 0, 200)
    colorContainer.Position = UDim2.new(0, 10, 0, 10)
    colorContainer.BackgroundTransparency = 1
    colorContainer.Parent = Tabs["ESP Colors"].Frame

    -- Seletor de cor
    local colorPickerLabel = Instance.new("TextLabel")
    colorPickerLabel.Name = "ColorPickerLabel"
    colorPickerLabel.Size = UDim2.new(1, 0, 0, 20)
    colorPickerLabel.Position = UDim2.new(0, 0, 0, 0)
    colorPickerLabel.Text = "Cor do ESP:"
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
    colorPreview.BackgroundColor3 = espColor
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
        
        local currentHue, currentSat, currentVal = Color3.toHSV(espColor)
        
        local function updateColor()
            espColor = Color3.fromHSV(currentHue, currentSat, currentVal)
            colorPreview.BackgroundColor3 = espColor
            saturationPicker.BackgroundColor3 = Color3.fromHSV(currentHue, 1, 1)
            updateESPColors()
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
    sliderFill.Size = UDim2.new(espTransparency, 0, 1, 0)
    sliderFill.Position = UDim2.new(0, 0, 0, 0)
    sliderFill.BackgroundColor3 = Theme.Accent
    sliderFill.Parent = sliderTrack

    local fillCorner = Instance.new("UICorner", sliderFill)
    fillCorner.CornerRadius = UDim.new(1, 0)

    local sliderThumb = Instance.new("Frame")
    sliderThumb.Name = "SliderThumb"
    sliderThumb.Size = UDim2.new(0, 20, 0, 20)
    sliderThumb.Position = UDim2.new(espTransparency, -10, 0.5, -10)
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
            espTransparency = x
            sliderFill.Size = UDim2.new(x, 0, 1, 0)
            sliderThumb.Position = UDim2.new(x, -10, 0.5, -10)
            updateESPColors()
        end
    end)
    
    -- Botão para aplicar as cores (pode ser útil se a atualização em tempo real for desativada)
    local applyButton = CreateButton("ESP Colors", "Aplicar Cores", updateESPColors)
    applyButton.Position = UDim2.new(0, 0, 0, 130)
end

-- Main Tab
CreateButton("Main", "Close UI", function()
    ScreenGui:Destroy()
end)

-- ESP Tab
local espDistConnections = {}
CreatePremiumToggle("ESP", "ESP Distância", false, function(state)
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
        texto.Color = espColor
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

        local char = jogador.Character
        if not char or not char:FindFirstChild("HumanoidRootPart") then
            objetos.fundo.Visible = false
            objetos.texto.Visible = false
            return
        end

        if jogoTemEquipes and jogador.Team == LocalPlayer.Team then
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
        objetos.texto.Position = Vector2.new(pos.X, pos.Y - 25) -- Ajustado para não sobrepor
        objetos.texto.Visible = true
        objetos.texto.Color = espColor

        local largura = #textoStr * 7
        objetos.fundo.Position = Vector2.new(pos.X - largura / 2 - 5, pos.Y - 23)
        objetos.fundo.Size = Vector2.new(largura + 10, 18)
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

local espToggle = CreatePremiumToggle("ESP", "esp line", false, function(state)
    if state then
        local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local Camera = workspace.CurrentCamera
local LocalPlayer = Players.LocalPlayer

local linhas = {}
_G.ESP_Ativo = true

local jogoTemEquipes = false
pcall(function()
    if LocalPlayer.Team ~= nil then
        jogoTemEquipes = true
    end
end)

local function criarLinha()
    local linha = Drawing.new("Line")
    linha.Thickness = 2
    linha.Color = Color3.fromRGB(255, 0, 0)
    linha.Transparency = 1
    linha.Visible = false
    return linha
end

local function atualizarLinha(jogador, linha)
    if not _G.ESP_Ativo then
        linha.Visible = false
        return
    end

    local char = jogador.Character
    if not char or not char:FindFirstChild("HumanoidRootPart") then
        linha.Visible = false
        return
    end

    if jogoTemEquipes and jogador.Team == LocalPlayer.Team then
        linha.Visible = false
        return
    end

    local pos3D = char.HumanoidRootPart.Position + Vector3.new(0, 1.5, 0)
    local pos2D, onScreen = Camera:WorldToViewportPoint(pos3D)

    if onScreen then
        linha.From = Vector2.new(Camera.ViewportSize.X / 2, 0) -- centro no topo da tela (cima)
        linha.To = Vector2.new(pos2D.X, pos2D.Y)
        linha.Visible = true
    else
        linha.Visible = false
    end
end

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
        local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local Camera = workspace.CurrentCamera
local LocalPlayer = Players.LocalPlayer

local linhas = {}
_G.ESP_Ativo = false

local jogoTemEquipes = false
pcall(function()
    if LocalPlayer.Team ~= nil then
        jogoTemEquipes = true
    end
end)

local function criarLinha()
    local linha = Drawing.new("Line")
    linha.Thickness = 2
    linha.Color = Color3.fromRGB(255, 0, 0)
    linha.Transparency = 1
    linha.Visible = false
    return linha
end

local function atualizarLinha(jogador, linha)
    if not _G.ESP_Ativo then
        linha.Visible = false
        return
    end

    local char = jogador.Character
    if not char or not char:FindFirstChild("HumanoidRootPart") then
        linha.Visible = false
        return
    end

    if jogoTemEquipes and jogador.Team == LocalPlayer.Team then
        linha.Visible = false
        return
    end

    local pos3D = char.HumanoidRootPart.Position + Vector3.new(0, 1.5, 0)
    local pos2D, onScreen = Camera:WorldToViewportPoint(pos3D)

    if onScreen then
        linha.From = Vector2.new(Camera.ViewportSize.X / 2, 0) -- centro no topo da tela (cima)
        linha.To = Vector2.new(pos2D.X, pos2D.Y)
        linha.Visible = true
    else
        linha.Visible = false
    end
end

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
    end
end)

local espToggle = CreatePremiumToggle("ESP", "esp esqueleto", false, function(state)
    if state then
        local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local camera = workspace.CurrentCamera
local localPlayer = Players.LocalPlayer

_G.ESP_Skeleton_Ativo = true -- ✅ Altere para false para desligar manualmente

-- Detecta se o jogo usa equipes
local jogoTemEquipes = false
pcall(function()
	if localPlayer.Team ~= nil then
		jogoTemEquipes = true
	end
end)

local function criarLinha()
	local l = Drawing.new("Line")
	l.Color = Color3.fromRGB(255, 255, 255)
	l.Thickness = 1.5
	l.Visible = false
	return l
end

-- Armazena as linhas de cada jogador
local linhas = {}

local function adicionarJogador(p)
	if p ~= localPlayer then
		linhas[p] = {}
		for i = 1, 5 do
			table.insert(linhas[p], criarLinha())
		end
	end
end

for _, p in pairs(Players:GetPlayers()) do
	adicionarJogador(p)
end

Players.PlayerAdded:Connect(adicionarJogador)

Players.PlayerRemoving:Connect(function(p)
	if linhas[p] then
		for _, l in ipairs(linhas[p]) do
			l:Remove()
		end
		linhas[p] = nil
	end
end)

local function getPos(character, partName)
	local part = character:FindFirstChild(partName)
	if part then
		local pos, onScreen = camera:WorldToViewportPoint(part.Position)
		if onScreen then
			return pos
		end
	end
	return nil
end

RunService.RenderStepped:Connect(function()
	for p, linhasJogador in pairs(linhas) do
		local char = p.Character
		if not char or not _G.ESP_Skeleton_Ativo then
			for _, l in ipairs(linhasJogador) do l.Visible = false end
			continue
		end

		if jogoTemEquipes and p.Team == localPlayer.Team then
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
        local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local camera = workspace.CurrentCamera
local localPlayer = Players.LocalPlayer

_G.ESP_Skeleton_Ativo = false

-- Detecta se o jogo usa equipes
local jogoTemEquipes = false
pcall(function()
	if localPlayer.Team ~= nil then
		jogoTemEquipes = true
	end
end)

local function criarLinha()
	local l = Drawing.new("Line")
	l.Color = Color3.fromRGB(255, 255, 255)
	l.Thickness = 1.5
	l.Visible = false
	return l
end

-- Armazena as linhas de cada jogador
local linhas = {}

local function adicionarJogador(p)
	if p ~= localPlayer then
		linhas[p] = {}
		for i = 1, 5 do
			table.insert(linhas[p], criarLinha())
		end
	end
end

for _, p in pairs(Players:GetPlayers()) do
	adicionarJogador(p)
end

Players.PlayerAdded:Connect(adicionarJogador)

Players.PlayerRemoving:Connect(function(p)
	if linhas[p] then
		for _, l in ipairs(linhas[p]) do
			l:Remove()
		end
		linhas[p] = nil
	end
end)

local function getPos(character, partName)
	local part = character:FindFirstChild(partName)
	if part then
		local pos, onScreen = camera:WorldToViewportPoint(part.Position)
		if onScreen then
			return pos
		end
	end
	return nil
end

RunService.RenderStepped:Connect(function()
	for p, linhasJogador in pairs(linhas) do
		local char = p.Character
		if not char or not _G.ESP_Skeleton_Ativo then
			for _, l in ipairs(linhasJogador) do l.Visible = false end
			continue
		end

		if jogoTemEquipes and p.Team == localPlayer.Team then
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
    end
end)

local espToggle = CreatePremiumToggle("ESP", "esp vida 1", false, function(state)
    if state then
        local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

_G.ESP_Vida_Ativo = true -- ✅ Altere para false para desligar a qualquer momento

-- Função para cor da vida
local function getLifeColor(pct)
	if pct > 0.5 then
		return Color3.fromRGB(0, 255, 0) -- Verde
	elseif pct > 0.2 then
		return Color3.fromRGB(255, 165, 0) -- Laranja
	else
		return Color3.fromRGB(255, 0, 0) -- Vermelho
	end
end

-- Detecta se o jogo usa times
local jogoTemEquipes = false
pcall(function()
	if LocalPlayer.Team ~= nil then
		jogoTemEquipes = true
	end
end)

-- Criar ESP de vida
local function criarBarraDeVida(jogador)
	local function setup()
		if not _G.ESP_Vida_Ativo then return end

		local char = jogador.Character
		if not char then return end

		local head = char:FindFirstChild("Head")
		local humanoid = char:FindFirstChildOfClass("Humanoid")
		if not head or not humanoid then return end

		if jogoTemEquipes and jogador.Team == LocalPlayer.Team then
			return -- Ignora aliados se for jogo de equipe
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
    else
        local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

_G.ESP_Vida_Ativo = false -- ✅ Altere para false para desligar a qualquer momento

-- Função para cor da vida
local function getLifeColor(pct)
	if pct > 0.5 then
		return Color3.fromRGB(0, 255, 0) -- Verde
	elseif pct > 0.2 then
		return Color3.fromRGB(255, 165, 0) -- Laranja
	else
		return Color3.fromRGB(255, 0, 0) -- Vermelho
	end
end

-- Detecta se o jogo usa times
local jogoTemEquipes = false
pcall(function()
	if LocalPlayer.Team ~= nil then
		jogoTemEquipes = true
	end
end)

-- Criar ESP de vida
local function criarBarraDeVida(jogador)
	local function setup()
		if not _G.ESP_Vida_Ativo then return end

		local char = jogador.Character
		if not char then return end

		local head = char:FindFirstChild("Head")
		local humanoid = char:FindFirstChildOfClass("Humanoid")
		if not head or not humanoid then return end

		if jogoTemEquipes and jogador.Team == LocalPlayer.Team then
			return -- Ignora aliados se for jogo de equipe
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
    end
end)

CreateButton("CHAMS", "chams transparent", function()
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local localPlayer = Players.LocalPlayer

-- Adiciona highlight nos inimigos
local function applyChams(player)
    if player == localPlayer then return end
    if not player.Character then return end
    if player.Character:FindFirstChild("ChamsHighlight") then return end

    local highlight = Instance.new("Highlight")
    highlight.Name = "ChamsHighlight"
    highlight.FillColor = Color3.fromRGB(0, 0, 0) -- Cor sólida (vermelho)
    highlight.OutlineColor = Color3.fromRGB(0, 0, 0)
    highlight.FillTransparency = 0.3
    highlight.OutlineTransparency = 0
    highlight.Adornee = player.Character
    highlight.Parent = player.Character
end

-- Remove o highlight se o jogador sair
local function removeChams(player)
    if player.Character and player.Character:FindFirstChild("ChamsHighlight") then
        player.Character:FindFirstChild("ChamsHighlight"):Destroy()
    end
end

-- Aplica Chams em jogadores existentes
for _, player in ipairs(Players:GetPlayers()) do
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
    if player.Character then
        applyChams(player)
    end
end

-- Quando um novo jogador entrar
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
end)

-- Remove chams se jogador sair
Players.PlayerRemoving:Connect(function(player)
    removeChams(player)
end)

-- Garante atualização dos chams
RunService.RenderStepped:Connect(function()
    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= localPlayer and player.Character and not player.Character:FindFirstChild("ChamsHighlight") then
            applyChams(player)
        end
    end
end)
end)

CreateButton("CHAMS", "red", function()
 local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local localPlayer = Players.LocalPlayer

-- Adiciona highlight nos inimigos
local function applyChams(player)
    if player == localPlayer then return end
    if not player.Character then return end
    if player.Character:FindFirstChild("ChamsHighlight") then return end

    local highlight = Instance.new("Highlight")
    highlight.Name = "ChamsHighlight"
    highlight.FillColor = Color3.fromRGB(150, 0, 0) -- Cor sólida (vermelho)
    highlight.OutlineColor = Color3.fromRGB(0, 0, 0)
    highlight.FillTransparency = 0.3
    highlight.OutlineTransparency = 0
    highlight.Adornee = player.Character
    highlight.Parent = player.Character
end

-- Remove o highlight se o jogador sair
local function removeChams(player)
    if player.Character and player.Character:FindFirstChild("ChamsHighlight") then
        player.Character:FindFirstChild("ChamsHighlight"):Destroy()
    end
end

-- Aplica Chams em jogadores existentes
for _, player in ipairs(Players:GetPlayers()) do
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
    if player.Character then
        applyChams(player)
    end
end

-- Quando um novo jogador entrar
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
end)

-- Remove chams se jogador sair
Players.PlayerRemoving:Connect(function(player)
    removeChams(player)
end)

-- Garante atualização dos chams
RunService.RenderStepped:Connect(function()
    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= localPlayer and player.Character and not player.Character:FindFirstChild("ChamsHighlight") then
            applyChams(player)
        end
    end
end)
end)

CreateButton("CHAMS", "yellow", function()
 local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local localPlayer = Players.LocalPlayer

-- Adiciona highlight nos inimigos
local function applyChams(player)
    if player == localPlayer then return end
    if not player.Character then return end
    if player.Character:FindFirstChild("ChamsHighlight") then return end

    local highlight = Instance.new("Highlight")
    highlight.Name = "ChamsHighlight"
    highlight.FillColor = Color3.fromRGB(200, 200, 0) -- Cor sólida (vermelho)
    highlight.OutlineColor = Color3.fromRGB(0, 0, 0)
    highlight.FillTransparency = 0.3
    highlight.OutlineTransparency = 0
    highlight.Adornee = player.Character
    highlight.Parent = player.Character
end

-- Remove o highlight se o jogador sair
local function removeChams(player)
    if player.Character and player.Character:FindFirstChild("ChamsHighlight") then
        player.Character:FindFirstChild("ChamsHighlight"):Destroy()
    end
end

-- Aplica Chams em jogadores existentes
for _, player in ipairs(Players:GetPlayers()) do
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
    if player.Character then
        applyChams(player)
    end
end

-- Quando um novo jogador entrar
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
end)

-- Remove chams se jogador sair
Players.PlayerRemoving:Connect(function(player)
    removeChams(player)
end)

-- Garante atualização dos chams
RunService.RenderStepped:Connect(function()
    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= localPlayer and player.Character and not player.Character:FindFirstChild("ChamsHighlight") then
            applyChams(player)
        end
    end
end)
end)

CreateButton("CHAMS", "blue", function()
 local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local localPlayer = Players.LocalPlayer

-- Adiciona highlight nos inimigos
local function applyChams(player)
    if player == localPlayer then return end
    if not player.Character then return end
    if player.Character:FindFirstChild("ChamsHighlight") then return end

    local highlight = Instance.new("Highlight")
    highlight.Name = "ChamsHighlight"
    highlight.FillColor = Color3.fromRGB(0, 0, 150) -- Cor sólida (vermelho)
    highlight.OutlineColor = Color3.fromRGB(0, 0, 0)
    highlight.FillTransparency = 0.3
    highlight.OutlineTransparency = 0
    highlight.Adornee = player.Character
    highlight.Parent = player.Character
end

-- Remove o highlight se o jogador sair
local function removeChams(player)
    if player.Character and player.Character:FindFirstChild("ChamsHighlight") then
        player.Character:FindFirstChild("ChamsHighlight"):Destroy()
    end
end

-- Aplica Chams em jogadores existentes
for _, player in ipairs(Players:GetPlayers()) do
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
    if player.Character then
        applyChams(player)
    end
end

-- Quando um novo jogador entrar
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
end)

-- Remove chams se jogador sair
Players.PlayerRemoving:Connect(function(player)
    removeChams(player)
end)

-- Garante atualização dos chams
RunService.RenderStepped:Connect(function()
    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= localPlayer and player.Character and not player.Character:FindFirstChild("ChamsHighlight") then
            applyChams(player)
        end
    end
end)
end)

CreateButton("CHAMS", "Green", function()
 local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local localPlayer = Players.LocalPlayer

-- Adiciona highlight nos inimigos
local function applyChams(player)
    if player == localPlayer then return end
    if not player.Character then return end
    if player.Character:FindFirstChild("ChamsHighlight") then return end

    local highlight = Instance.new("Highlight")
    highlight.Name = "ChamsHighlight"
    highlight.FillColor = Color3.fromRGB(0, 150, 0) -- Cor sólida (vermelho)
    highlight.OutlineColor = Color3.fromRGB(0, 0, 0)
    highlight.FillTransparency = 0.3
    highlight.OutlineTransparency = 0
    highlight.Adornee = player.Character
    highlight.Parent = player.Character
end

-- Remove o highlight se o jogador sair
local function removeChams(player)
    if player.Character and player.Character:FindFirstChild("ChamsHighlight") then
        player.Character:FindFirstChild("ChamsHighlight"):Destroy()
    end
end

-- Aplica Chams em jogadores existentes
for _, player in ipairs(Players:GetPlayers()) do
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
    if player.Character then
        applyChams(player)
    end
end

-- Quando um novo jogador entrar
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
end)

-- Remove chams se jogador sair
Players.PlayerRemoving:Connect(function(player)
    removeChams(player)
end)

-- Garante atualização dos chams
RunService.RenderStepped:Connect(function()
    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= localPlayer and player.Character and not player.Character:FindFirstChild("ChamsHighlight") then
            applyChams(player)
        end
    end
end)
end)

CreateButton("CHAMS", "White", function()
 local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local localPlayer = Players.LocalPlayer

-- Adiciona highlight nos inimigos
local function applyChams(player)
    if player == localPlayer then return end
    if not player.Character then return end
    if player.Character:FindFirstChild("ChamsHighlight") then return end

    local highlight = Instance.new("Highlight")
    highlight.Name = "ChamsHighlight"
    highlight.FillColor = Color3.fromRGB(200, 200, 200) -- Cor sólida (vermelho)
    highlight.OutlineColor = Color3.fromRGB(0, 0, 0)
    highlight.FillTransparency = 0.3
    highlight.OutlineTransparency = 0
    highlight.Adornee = player.Character
    highlight.Parent = player.Character
end

-- Remove o highlight se o jogador sair
local function removeChams(player)
    if player.Character and player.Character:FindFirstChild("ChamsHighlight") then
        player.Character:FindFirstChild("ChamsHighlight"):Destroy()
    end
end

-- Aplica Chams em jogadores existentes
for _, player in ipairs(Players:GetPlayers()) do
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
    if player.Character then
        applyChams(player)
    end
end

-- Quando um novo jogador entrar
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
end)

-- Remove chams se jogador sair
Players.PlayerRemoving:Connect(function(player)
    removeChams(player)
end)

-- Garante atualização dos chams
RunService.RenderStepped:Connect(function()
    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= localPlayer and player.Character and not player.Character:FindFirstChild("ChamsHighlight") then
            applyChams(player)
        end
    end
end)
end)

CreateButton("CHAMS", "Purple", function()
 local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local localPlayer = Players.LocalPlayer

-- Adiciona highlight nos inimigos
local function applyChams(player)
    if player == localPlayer then return end
    if not player.Character then return end
    if player.Character:FindFirstChild("ChamsHighlight") then return end

    local highlight = Instance.new("Highlight")
    highlight.Name = "ChamsHighlight"
    highlight.FillColor = Color3.fromRGB(150, 0, 150) -- Cor sólida (vermelho)
    highlight.OutlineColor = Color3.fromRGB(0, 0, 0)
    highlight.FillTransparency = 0.3
    highlight.OutlineTransparency = 0
    highlight.Adornee = player.Character
    highlight.Parent = player.Character
end

-- Remove o highlight se o jogador sair
local function removeChams(player)
    if player.Character and player.Character:FindFirstChild("ChamsHighlight") then
        player.Character:FindFirstChild("ChamsHighlight"):Destroy()
    end
end

-- Aplica Chams em jogadores existentes
for _, player in ipairs(Players:GetPlayers()) do
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
    if player.Character then
        applyChams(player)
    end
end

-- Quando um novo jogador entrar
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function()
        task.wait(1)
        applyChams(player)
    end)
end)

-- Remove chams se jogador sair
Players.PlayerRemoving:Connect(function(player)
    removeChams(player)
end)

-- Garante atualização dos chams
RunService.RenderStepped:Connect(function()
    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= localPlayer and player.Character and not player.Character:FindFirstChild("ChamsHighlight") then
            applyChams(player)
        end
    end
end)
end)

-- Default variables for Aimbot
local AimFov = 70
local AimSmoothing = 0.5 -- Changed default to 0.5 for a smoother start
local AimPart = "Head"
_G.Aimbot_Ativo = false -- Initialize global state to false
local AimTeamCheck = false -- New default for team check
local AimVisible = false -- New default for aim visible check

-- Services
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local Camera = workspace.CurrentCamera

-- Theme (Assuming 'Theme' is defined elsewhere in your script)
-- Example placeholder if not defined:
local Theme = {
    Text = Color3.fromRGB(255, 255, 255),
    Accent = Color3.fromRGB(0, 150, 255),
    Button = Color3.fromRGB(50, 50, 50),
    TabInactive = Color3.fromRGB(70, 70, 70),
}

-- CreatePremiumToggle function (Assuming this function is defined elsewhere)
-- Example placeholder if not defined:
local function CreatePremiumToggle(name, labelText, defaultState, callback)
    local toggleContainer = Instance.new("Frame")
    toggleContainer.Name = name .. "ToggleContainer"
    toggleContainer.Size = UDim2.new(1, -20, 0, 40)
    toggleContainer.Position = UDim2.new(0, 10, 0, 10) -- Adjust position as needed
    toggleContainer.BackgroundTransparency = 1
    -- Parent will be set later

    local toggleButton = Instance.new("TextButton")
    toggleButton.Size = UDim2.new(1, 0, 1, 0)
    toggleButton.Text = labelText .. ": " .. (defaultState and "ON" or "OFF")
    toggleButton.TextSize = 14
    toggleButton.BackgroundColor3 = Theme.Button
    toggleButton.TextColor3 = Theme.Text
    toggleButton.Font = Enum.Font.Gotham
    toggleButton.Parent = toggleContainer
    Instance.new("UICorner", toggleButton).CornerRadius = UDim.new(0, 6)

    local currentState = defaultState
    toggleButton.MouseButton1Click:Connect(function()
        currentState = not currentState
        toggleButton.Text = labelText .. ": " .. (currentState and "ON" or "OFF")
        callback(currentState)
    end)
    return toggleContainer
end


-- Reference to the Aimbot tab frame
local tabFrame = Tabs["AIMBOT"].Frame

---
-- Aimbot Toggles
---
local aimbotToggle = CreatePremiumToggle("AIMBOT", "Aimbot", false, function(state)
    _G.Aimbot_Ativo = state
end)
aimbotToggle.Position = UDim2.new(0, 10, 0, 10)
aimbotToggle.Parent = tabFrame

local teamCheckToggle = CreatePremiumToggle("TEAMCHECK", "aim inimigos", false, function(state)
    AimTeamCheck = state
end)
teamCheckToggle.Position = UDim2.new(0, 10, 0, 60)
teamCheckToggle.Parent = tabFrame

local aimVisibleToggle = CreatePremiumToggle("AIMVISIBLE", "Aim Visible", false, function(state)
    AimVisible = state
end)
aimVisibleToggle.Position = UDim2.new(0, 10, 0, 110)
aimVisibleToggle.Parent = tabFrame

---
-- FOV SLIDER
---
local fovContainer = Instance.new("Frame")
fovContainer.Name = "FovContainer"
fovContainer.Size = UDim2.new(1, -20, 0, 50)
fovContainer.Position = UDim2.new(0, 10, 0, 170)
fovContainer.BackgroundTransparency = 1
fovContainer.Parent = tabFrame

local fovLabel = Instance.new("TextLabel")
fovLabel.Size = UDim2.new(1, 0, 0, 20)
fovLabel.Text = "Aim FOV: " .. AimFov
fovLabel.TextSize = 14
fovLabel.TextXAlignment = Enum.TextXAlignment.Left
fovLabel.BackgroundTransparency = 1
fovLabel.TextColor3 = Theme.Text
fovLabel.Font = Enum.Font.Gotham
fovLabel.Parent = fovContainer

local fovSliderTrack = Instance.new("Frame")
fovSliderTrack.Size = UDim2.new(1, 0, 0, 10)
fovSliderTrack.Position = UDim2.new(0, 0, 0, 25)
fovSliderTrack.BackgroundColor3 = Theme.TabInactive
fovSliderTrack.Parent = fovContainer

Instance.new("UICorner", fovSliderTrack).CornerRadius = UDim.new(1, 0)

local fovSliderFill = Instance.new("Frame")
fovSliderFill.Size = UDim2.new(AimFov / 200, 0, 1, 0) -- Initial size based on AimFov
fovSliderFill.BackgroundColor3 = Theme.Accent
fovSliderFill.Parent = fovSliderTrack
Instance.new("UICorner", fovSliderFill).CornerRadius = UDim.new(1, 0)

local fovSliderThumb = Instance.new("Frame")
fovSliderThumb.Size = UDim2.new(0, 20, 0, 20)
fovSliderThumb.Position = UDim2.new(AimFov / 200, -10, 0.5, -10) -- Initial position based on AimFov
fovSliderThumb.BackgroundColor3 = Theme.Text
fovSliderThumb.Parent = fovSliderTrack
Instance.new("UICorner", fovSliderThumb).CornerRadius = UDim.new(1, 0)

---
-- SMOOTHING SLIDER
---
local smoothContainer = Instance.new("Frame")
smoothContainer.Name = "SmoothContainer"
smoothContainer.Size = UDim2.new(1, -20, 0, 50)
smoothContainer.Position = UDim2.new(0, 10, 0, 230) -- Adjusted Y position
smoothContainer.BackgroundTransparency = 1
smoothContainer.Parent = tabFrame -- Parented to the AIMBOT tab

local smoothLabel = Instance.new("TextLabel")
smoothLabel.Size = UDim2.new(1, 0, 0, 20)
smoothLabel.Text = "Smoothing: " .. string.format("%.1f", AimSmoothing)
smoothLabel.TextSize = 14
smoothLabel.TextXAlignment = Enum.TextXAlignment.Left
smoothLabel.BackgroundTransparency = 1
smoothLabel.TextColor3 = Theme.Text
smoothLabel.Font = Enum.Font.Gotham
smoothLabel.Parent = smoothContainer

local smoothSliderTrack = Instance.new("Frame")
smoothSliderTrack.Size = UDim2.new(1, 0, 0, 10)
smoothSliderTrack.Position = UDim2.new(0, 0, 0, 25)
smoothSliderTrack.BackgroundColor3 = Theme.TabInactive
smoothSliderTrack.Parent = smoothContainer
Instance.new("UICorner", smoothSliderTrack).CornerRadius = UDim.new(1, 0)

local smoothSliderFill = Instance.new("Frame")
smoothSliderFill.Size = UDim2.new(AimSmoothing, 0, 1, 0) -- Initial size based on AimSmoothing (range 0-1)
smoothSliderFill.BackgroundColor3 = Theme.Accent
smoothSliderFill.Parent = smoothSliderTrack
Instance.new("UICorner", smoothSliderFill).CornerRadius = UDim.new(1, 0)

local smoothSliderThumb = Instance.new("Frame")
smoothSliderThumb.Size = UDim2.new(0, 20, 0, 20)
smoothSliderThumb.Position = UDim2.new(AimSmoothing, -10, 0.5, -10) -- Initial position based on AimSmoothing (range 0-1)
smoothSliderThumb.BackgroundColor3 = Theme.Text
smoothSliderThumb.Parent = smoothSliderTrack
Instance.new("UICorner", smoothSliderThumb).CornerRadius = UDim.new(1, 0)

---
-- AIM PART SELECTOR
---
local partSelection = Instance.new("TextButton")
partSelection.Size = UDim2.new(1, -20, 0, 40)
partSelection.Position = UDim2.new(0, 10, 0, 290) -- Adjusted Y position
partSelection.Text = "Aim Part: " .. AimPart
partSelection.TextSize = 14
partSelection.BackgroundColor3 = Theme.Button
partSelection.TextColor3 = Theme.Text
partSelection.Font = Enum.Font.Gotham
partSelection.Parent = tabFrame -- Parented to the AIMBOT tab
Instance.new("UICorner", partSelection).CornerRadius = UDim.new(0, 6)

partSelection.MouseButton1Click:Connect(function()
    AimPart = (AimPart == "Head" and "HumanoidRootPart") or "Head"
    partSelection.Text = "Aim Part: " .. AimPart
end)

---
-- SLIDER FUNCTIONALITY (Adapted to use global UserInputService and TweenService)
---
local function setupSlider(track, fill, thumb, label, minVal, maxVal, initVal, callback)
    local dragging = false

    local function update(input)
        -- Get position relative to the track frame
        local x = (input.Position.X - track.AbsolutePosition.X) / track.AbsoluteSize.X
        x = math.clamp(x, 0, 1)
        local value = minVal + (maxVal - minVal) * x

        -- Update fill and thumb based on 'x' directly for visual representation
        fill.Size = UDim2.new(x, 0, 1, 0)
        thumb.Position = UDim2.new(x, -10, 0.5, -10)

        if label then
            -- Determine if value should be integer or float for display
            -- If the range is small (e.g., 0-1 for smoothing), format as float. Otherwise, as integer.
            local displayText = ((maxVal - minVal) <= 10) and string.format("%.1f", value) or tostring(math.floor(value))
            label.Text = label.Text:match("^(.-: )") .. displayText
        end

        callback(value)
    end

    -- Mouse and Touch input handling
    track.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = true
            update(input)
        end
    end)

    UserInputService.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = false
        end
    end)

    UserInputService.InputChanged:Connect(function(input)
        if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
            update(input)
        end
    end)
    
    -- Set initial state of slider visual elements
    local initialX = (initVal - minVal) / (maxVal - minVal)
    fill.Size = UDim2.new(initialX, 0, 1, 0)
    thumb.Position = UDim2.new(initialX, -10, 0.5, -10)
    if label then
        local initialDisplayText = ((maxVal - minVal) <= 10) and string.format("%.1f", initVal) or tostring(math.floor(initVal))
        label.Text = label.Text:match("^(.-: )") .. initialDisplayText
    end
end

-- Apply sliders
-- Ensure the position parameters for the containers are correct relative to the tabFrame
setupSlider(fovSliderTrack, fovSliderFill, fovSliderThumb, fovLabel, 0, 360, AimFov, function(val)
    AimFov = math.floor(val)
    fovLabel.Text = "Aim FOV: " .. AimFov
end)

-- Smoothing is typically 0 to 1 for Lerp. Changed max to 1.
setupSlider(smoothSliderTrack, smoothSliderFill, smoothSliderThumb, smoothLabel, 0, 1, AimSmoothing, function(val)
    AimSmoothing = val
    smoothLabel.Text = "Smoothing: " .. string.format("%.1f", AimSmoothing)
end)


---
-- MAIN AIMBOT FUNCTIONALITY (adapted from your working script)
---
local function IsVisible(targetPart)
    local origin = Camera.CFrame.Position
    local direction = (targetPart.Position - origin).Unit
    local ray = Ray.new(origin, direction * 1000) -- Ray length doesn't matter too much if it hits the target

    local hit, position = workspace:FindPartOnRay(ray, LocalPlayer.Character)
    -- Check if the ray hit something and if that something is the target part or one of its descendants
    return hit and (hit == targetPart or hit:IsDescendantOf(targetPart.Parent))
end

local function GetClosestPlayer()
    -- Only run if aimbot is active via the _G.Aimbot_Ativo global variable set by the toggle
    if not _G.Aimbot_Ativo then return nil end

    local mousePos = Vector2.new(Camera.ViewportSize.X / 2, Camera.ViewportSize.Y / 2)
    local closestPlayer, shortestDistance = nil, AimFov -- Use AimFov for initial shortest distance

    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= LocalPlayer and player.Character and player.Character:FindFirstChild(AimPart) and player.Character:FindFirstChild("Humanoid") then
            local humanoid = player.Character.Humanoid
            if humanoid.Health > 0 then
                -- Team Check: If AimTeamCheck is true, only target if teams are different
                -- This assumes your game uses the Team property for players and not neutral teams
                if AimTeamCheck and LocalPlayer.Team and player.Team and player.Team == LocalPlayer.Team then
                    continue -- Skip if on the same team and team check is active
                end

                local part = player.Character[AimPart]
                local screenPos, onScreen = Camera:WorldToViewportPoint(part.Position)

                if onScreen then
                    -- Aim Visible Check: If AimVisible is true, only target if the part is visible
                    if AimVisible and not IsVisible(part) then
                        continue -- Skip if not visible and aim visible is active
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

local function AimAtTarget(pos)
    local cf = Camera.CFrame
    local direction = (pos - cf.Position).Unit
    local targetCF = CFrame.new(cf.Position, cf.Position + direction)
    -- Apply smoothing based on the AimSmoothing variable
    Camera.CFrame = cf:Lerp(targetCF, AimSmoothing)
end

-- Update every frame using RenderStepped for smooth aiming
RunService.RenderStepped:Connect(function()
    -- Only run if aimbot is active via the _G.Aimbot_Ativo global variable
    if not _G.Aimbot_Ativo then return end

    local target = GetClosestPlayer()
    if target and target.Character and target.Character:FindFirstChild(AimPart) then
        AimAtTarget(target.Character[AimPart].Position)
    end
end)

MainPanel.Visible = false
FloatButton.Text = "☰"
